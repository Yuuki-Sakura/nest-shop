import { AppConfig } from '@/app.config';
import { AppController } from '@/app.controller';
import { ExceptionFilterProvider } from '@/common/filters/exception.filter';
import { LoggingInterceptorProvider } from '@/common/interceptors/logging.interceptor';
import { TypeOrmLogger } from '@/common/logger/type-orm.logger';
import { CorsMiddleware } from '@/common/middlewares/cors.middleware';
import { OriginMiddleware } from '@/common/middlewares/origin.middleware';
import { UserModule } from '@/user/user.module';
import { DateScalar, DecimalScalar } from '@adachi-sakura/nest-shop-common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ajv, { ErrorObject } from 'ajv';
import merge from 'deepmerge';
import { fileLoader, TypedConfigModule } from 'nest-typed-config';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: fileLoader({
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
    // OpenTelemetryModule.forRootAsync({
    //   imports: [AppConfig],
    //   useFactory: (config: AppConfig) => {
    //     console.log(moduleRef);
    //     return {
    //       spanProcessor: new SimpleSpanProcessor(
    //         new JaegerExporter({
    //           endpoint: 'http://101.34.66.96:14268/api/traces',
    //         }),
    //       ),
    //     };
    //   },
    //   inject: [AppConfig],
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: AppConfig) => {
        return {
          ...config.database,
          logger: new TypeOrmLogger(),
        };
      },
      inject: [AppConfig],
    }),
    GraphQLModule.forRootAsync({
      useFactory: (config: AppConfig) => config.graphql,
      inject: [AppConfig],
    }),
    RedisModule.forRootAsync({
      useFactory: (config: AppConfig) => config.redis,
      inject: [AppConfig],
    }),
    UserModule,
    // AuthModule,
    // RoleModule,
    // PermissionModule,
  ],
  providers: [
    Logger,
    LoggingInterceptorProvider,
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
