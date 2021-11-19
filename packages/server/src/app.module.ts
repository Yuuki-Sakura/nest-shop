import { AppConfig } from '@/app.config';
import { DateScalar, DecimalScalar } from '@adachi-sakura/nest-shop-common';
import { ExceptionFilterProvider } from '@/common/filters/exception.filter';
import { LoggingInterceptorProvider } from '@/common/interceptors/logging.interceptor';
import { CorsMiddleware } from '@/common/middlewares/cors.middleware';
import { OriginMiddleware } from '@/common/middlewares/origin.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MiddlewareConsumer, Module } from '@nestjs/common';
//中间件
import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { RoleModule } from '@/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '@/permission/permission.module';
import { isProdMode } from '@/app.environment';
import { LoggerModule } from '@/app.logger';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '@/user/user.module';
import { fileLoader, TypedConfigModule } from 'nest-typed-config';

//配置文件
// 业务模块
@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: fileLoader({
        basename: 'nest-shop-config',
      }),
      validate: (rawConfig: any) => {
        console.log(rawConfig);
        return rawConfig;
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: AppConfig) => config.database,
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
    LoggerModule,
  ],
  providers: [
    ExceptionFilterProvider,
    LoggingInterceptorProvider,
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
