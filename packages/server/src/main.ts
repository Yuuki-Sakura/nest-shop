import { AuthService } from '@/auth/service/auth.service';
import { permissions } from '@/auth/auth.utils';
import { WinstonLogger } from '@/common/logger/winston.logger';
import { PermissionService } from '@/permission/permission.service';
import otelSDK from '@/tracing';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { HttpMethod, Role, UserRole } from '@adachi-sakura/nest-shop-entity';
import { ExpressAdapter } from '@nestjs/platform-express';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import { context, trace } from '@opentelemetry/api';
import * as fs from 'fs';
import { Redis } from 'ioredis';
import path from 'path';
import { Repository } from 'typeorm';
import {
  DEFAULT_REDIS_NAMESPACE,
  getRedisToken,
} from '@adachi-sakura/nestjs-redis';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { environment } from '@/app.environment';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import requestIp from 'request-ip';
import session from 'express-session';
import express from 'express';
import spdy from 'spdy';

let app: NestApplication;

async function init(app: NestApplication) {
  const permissionService: PermissionService =
    app.get<PermissionService>(PermissionService);
  for (const { resource, name, type, target, descriptor } of permissions) {
    const route = (() => {
      let controllerPath: string = Reflect.getMetadata(
          'path',
          target.constructor,
        ),
        methodPath: string = Reflect.getMetadata('path', descriptor.value);
      if (!controllerPath) {
        return;
      }
      if (controllerPath.charAt(0) !== '/')
        controllerPath = '/' + controllerPath;
      if (controllerPath.charAt(controllerPath.length - 1) !== '/')
        controllerPath = controllerPath + '/';
      if (methodPath.charAt(0) === '/') methodPath = methodPath.slice(1);
      return controllerPath + methodPath;
    })();
    const method: HttpMethod = RequestMethod[
      Reflect.getMetadata('method', descriptor.value) as number
    ] as HttpMethod;
    if (!(await permissionService.findOne({ resource })))
      await permissionService.save({ resource, name, route, method, type });
  }

  //添加AdminRole
  const roleRepo: Repository<Role> = app.get<Repository<Role>>(
    getRepositoryToken(Role, DEFAULT_CONNECTION_NAME),
  );
  const adminRole =
    (await roleRepo.findOne({
      name: 'root',
    })) ||
    (await roleRepo.save(
      roleRepo.create({
        name: 'root',
        permissions: ['*'],
      }),
    ));

  //创建管理员用户
  const userService: UserService = app.get<UserService>(UserService);
  const authService: AuthService = app.get<AuthService>(AuthService);
  const userRepo: UserRepository = app.get<UserRepository>(
    getRepositoryToken(UserRepository, DEFAULT_CONNECTION_NAME),
  );
  const config: AppConfig = app.get<AppConfig>(AppConfig);
  if (
    !(await userRepo.findOneByPhoneOrEmail(config.server.rootAccount.email))
  ) {
    await authService.register({
      email: config.server.rootAccount.email,
      password: '12345678',
    });
  }
  const user = await userService.findOneByPhoneOrEmail(
    config.server.rootAccount.email,
  );
  const userRoleRepo: Repository<UserRole> = app.get<Repository<UserRole>>(
    getRepositoryToken(UserRole, DEFAULT_CONNECTION_NAME),
  );
  if (
    !(await userRoleRepo.findOne({
      user,
      role: adminRole,
    }))
  ) {
    await userRoleRepo.save(
      userRoleRepo.create({
        user,
        role: adminRole,
      }),
    );
  }
  return;
}

async function bootstrap() {
  await otelSDK.start();
  const server = express();
  app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: WinstonLogger,
  });
  const config = app.get<AppConfig>(AppConfig);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: false,
  });
  app.use((req, res, next) => {
    req.requestAt = Date.now();
    const tracer = trace.getTracer('default');
    const span = tracer.startSpan(`Request: ${req.method} -> ${req.url}`, {
      root: true,
    });
    span.setAttributes({
      url: req.url,
      method: req.method,
    });
    req.span = span;
    context.with(trace.setSpan(context.active(), span), () => {
      next();
    });
  });
  app.use(requestIp.mw());
  app.use(session(config.server.session));
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(compression());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  app.useGlobalPipes(new ValidationPipe(config.server.validator));
  app.setGlobalPrefix(config.server.prefix);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Nest Shop')
      .setVersion('0.0.1')
      .build(),
  );
  SwaggerModule.setup(config.swagger.prefix, app, document, config.swagger);

  await init(app);
  await app.init();
  const redis = app.get<Redis>(getRedisToken(DEFAULT_REDIS_NAMESPACE));
  const logger = app.get<Logger>(Logger);
  spdy
    .createServer(
      {
        key: fs.readFileSync(path.join(process.cwd(), './localhost.key')),
        cert: fs.readFileSync(path.join(process.cwd(), './localhost.crt')),
      },
      server,
    )
    .on('newSession', (sessionId: Buffer, sessionData: Buffer, callback) => {
      logger.log(`New Session id: ${sessionId.toString('hex')}`, 'TLS Session');
      redis.setBuffer(sessionId.toString('hex'), sessionData).then(() => {
        callback(null, sessionData);
      });
    })
    .on('resumeSession', (sessionId: Buffer, callback) => {
      redis.getBuffer(sessionId.toString('hex')).then((sessionData) => {
        logger.log(
          `Resume Session ${
            sessionData ? 'success' : 'failure'
          } id: ${sessionId.toString('hex')}`,
          'TLS Session',
        );
        callback(null, sessionData);
      });
    })
    .listen(4443, () => {
      logger.log(
        `Nest Shop Run！at https://localhost:${
          4443 + config.server.prefix
        } env:${environment}`,
        'NestApplication',
      );
    });
  return app.listen(config.server.port);
}

bootstrap().then(async () => {
  const logger = app.get<Logger>(Logger);
  const config = app.get<AppConfig>(AppConfig);
  // await init(app);
  logger.log(
    `Nest Shop Run！at http://localhost:${
      config.server.port + config.server.prefix
    } env:${environment}`,
    'NestApplication',
  );
  logger.log(
    `Swagger is running at http://localhost:${
      config.server.port + config.swagger.prefix
    }`,
    'NestApplication',
  );
  logger.log(
    `GraphQL is running at http://localhost:${
      config.server.port + config.server.prefix + config.graphql.path
    }`,
    'NestApplication',
  );
});
