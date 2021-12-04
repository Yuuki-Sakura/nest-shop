import { AppConfig } from '@/app.config';
import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { ExceptionFilterProvider } from '@/common/filters/exception.filter';
import { LoggingInterceptorProvider } from '@/common/interceptors/logging.interceptor';
import { TransformInterceptorProvider } from '@/common/interceptors/transform.interceptor';
import { TypeOrmLogger } from '@/common/logger/type-orm.logger';
import { CorsMiddleware } from '@/common/middlewares/cors.middleware';
import { OriginMiddleware } from '@/common/middlewares/origin.middleware';
import { watchFileLoader } from '@/common/utils/watch-file-loader';
import { PermissionModule } from '@/permission/permission.module';
import { RoleModule } from '@/role/role.module';
import { UserModule } from '@/user/user.module';
import { DateScalar, DecimalScalar } from '@adachi-sakura/nest-shop-common';
import { RedisModule } from '@adachi-sakura/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import Ajv, { ErrorObject } from 'ajv';
import merge from 'deepmerge';
import IORedis, { Command, RedisOptions } from 'ioredis';
import { fileLoader, TypedConfigModule } from 'nest-typed-config';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: watchFileLoader({
        basename: 'nest-shop-config',
      }),
      validate: (rawConfig: any) => {
        const schema = fileLoader({
          basename: 'nest-shop-config.schema',
        })();
        const validate = new Ajv({
          allowUnionTypes: true,
          verbose: true,
        }).compile(schema);
        validate(rawConfig);
        if (validate.errors) {
          throw new Error(
            TypedConfigModule.getConfigErrorMessage(
              validate.errors
                .reduce((prev: ErrorObject[], current) => {
                  const findIndex = prev.findIndex(
                    (item) => item.instancePath === current.instancePath,
                  );
                  if (findIndex === -1) {
                    prev.push(current);
                  } else {
                    const error = prev[findIndex];
                    const mergedParams = merge(error.params, current.params);
                    prev.splice(findIndex, 1, {
                      ...error,
                      params: mergedParams,
                    });
                  }
                  return prev;
                }, [])
                .map((item) => ({
                  property: item.instancePath,
                  value: item.data,
                  constraints: item.params,
                })),
            ),
          );
        }
        return rawConfig;
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'zh-CN',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(process.cwd(), '/i18n/'),
        watch: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: AppConfig) => {
        return {
          ...config.database,
          logger: new TypeOrmLogger(config.database.logging),
        };
      },
      inject: [AppConfig],
    }),
    GraphQLModule.forRootAsync({
      useFactory: (config: AppConfig) => config.graphql,
      inject: [AppConfig],
    }),
    RedisModule.forRootAsync({
      imports: [Logger],
      useFactory: (
        config: AppConfig,
        logger: Logger = new Logger('Redis'),
      ) => ({
        ...config.redis,
        proxyHandler: {
          get(target: IORedis.Redis, property: keyof IORedis.Redis): any {
            if (property !== 'sendCommand') {
              return target[property];
            }
            return new Proxy(target[property], {
              apply(target, thisArg: IORedis.Redis, argArray: Command[]): any {
                const invokeAt = Date.now();
                const command = argArray[0];
                const commandName = command.name.toUpperCase();
                const tracer = trace.getTracer('default');
                const currentSpan =
                  trace.getSpan(context.active()) ??
                  tracer.startSpan('default');
                return context.with(
                  trace.setSpan(context.active(), currentSpan),
                  () => {
                    const span = tracer.startSpan(`Redis: ${commandName}`);
                    span.setAttributes({
                      command: commandName,
                      args: command['args'],
                    });
                    logger.log(
                      `[invoke-at: ${invokeAt}] [command: ${commandName}] args: ${JSON.stringify(
                        command['args'],
                      )}`,
                    );
                    (command['promise'] as Promise<any>)
                      .then((res) => {
                        span.setAttributes({
                          result: res,
                        });
                        span.end();
                        logger.log(
                          `[invoke-at: ${invokeAt}] [command: ${commandName}] args: ${JSON.stringify(
                            command['args'],
                          )} result: ${JSON.stringify(res)} time: ${
                            Date.now() - invokeAt
                          }ms`,
                        );
                        return res;
                      })
                      .catch((err: Error) => {
                        span.recordException(err);
                        span.setStatus({
                          code: SpanStatusCode.ERROR,
                          message: err.message,
                        });
                        span.end();
                        logger.error(
                          `[invoke-at: ${invokeAt}] [command: ${commandName}] args: ${JSON.stringify(
                            command['args'],
                          )} error: ${err.message} time: ${
                            Date.now() - invokeAt
                          }ms`,
                          err,
                        );
                        throw err;
                      });
                    return target.apply(thisArg, argArray);
                  },
                );
              },
            });
          },
        },
      }),
      inject: [AppConfig],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: (config: AppConfig) => ({
        redis: config.redis.config as RedisOptions,
      }),
      inject: [AppConfig],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [
    Logger,
    LoggingInterceptorProvider,
    TransformInterceptorProvider,
    ExceptionFilterProvider,
    DateScalar,
    DecimalScalar,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
