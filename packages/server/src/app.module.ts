import { AppConfig } from '@/app.config';
import { AuthModule } from '@/auth/auth.module';
import { ExceptionFilterProvider } from '@/common/filters/exception.filter';
import { LoggingInterceptorProvider } from '@/common/interceptors/logging.interceptor';
import { TransformInterceptorProvider } from '@/common/interceptors/transform.interceptor';
import { TypeOrmLogger } from '@/common/logger/type-orm.logger';
import { CorsMiddleware } from '@/common/middlewares/cors.middleware';
import { OriginMiddleware } from '@/common/middlewares/origin.middleware';
import { redisProxyHandler } from '@/common/utils/redis-proxy-handler';
import { schemaValidator } from '@/common/utils/schema-validator';
import { watchFileLoader } from '@/common/utils/watch-file-loader';
import { DistrictModule } from '@/district/district.module';
import { PermissionModule } from '@/permission/permission.module';
import { RoleModule } from '@/role/role.module';
import { UserModule } from '@/user/user.module';
import { DateScalar, DecimalScalar } from '@adachi-sakura/nest-shop-common';
import { ConsulModule } from '@adachi-sakura/nestjs-consul';
import { RedisModule } from '@adachi-sakura/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisOptions } from 'ioredis';
import { TypedConfigModule } from 'nest-typed-config';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    ConsulModule.forRoot({
      config: {
        host: '101.34.66.96',
        port: '8500',
      },
      service: {
        name: 'nest-shop',
        port: 4443,
      },
      health: {
        route: '/api/health',
        protocol: 'https',
      },
    }),
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: watchFileLoader({
        basename: 'nest-shop-config',
      }),
      validate: schemaValidator,
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
      useFactory: (config: AppConfig) => ({
        ...config.graphql,
      }),
      inject: [AppConfig],
    }),
    RedisModule.forRootAsync({
      imports: [Logger],
      useFactory: (
        config: AppConfig,
        logger: Logger = new Logger('Redis'),
      ) => ({
        ...config.redis,
        proxyHandler: redisProxyHandler(logger),
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
    MulterModule.register({
      dest: path.join(process.cwd(), '/public/upload'),
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    DistrictModule,
  ],
  providers: [
    Logger,
    LoggingInterceptorProvider,
    TransformInterceptorProvider,
    ExceptionFilterProvider,
    DateScalar,
    DecimalScalar,
  ],
  // controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
