import { DateScalar, RedisModule } from '@adachi-sakura/nest-shop-common';
import { ExceptionFilterProvider } from '@/common/filters/exception.filter';
import { LoggingInterceptorProvider } from '@/common/interceptors/logging.interceptor';
import { CorsMiddleware } from '@/common/middlewares/cors.middleware';
import { OriginMiddleware } from '@/common/middlewares/origin.middleware';
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

//配置文件

// 业务模块
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      logging: !isProdMode,
    }),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      useGlobalPrefix: true,
      path: 'gql',
    }),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    LoggerModule,
  ],
  providers: [ExceptionFilterProvider, LoggingInterceptorProvider, DateScalar],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
