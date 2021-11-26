import { permissions } from '@/auth/auth.utils';
import { PermissionService } from '@/permission/permission.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { HttpMethod, Role, UserRole } from '@adachi-sakura/nest-shop-entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import { Repository } from 'typeorm';
import { AppConfig } from './app.config';
import clc from 'cli-color';
import bare from 'cli-color/bare';
import safeStringify from 'fast-safe-stringify';
import { WinstonModule } from 'nest-winston';
import { inspect } from 'util';
import { format, transports } from 'winston';
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
import rTracer from 'cls-rtracer';
import { nanoid } from '@adachi-sakura/nest-shop-common';
import requestIp from 'request-ip';
import session from 'express-session';

let app: NestApplication;

async function init(app: NestApplication) {
  const permissionService: PermissionService =
    app.get<PermissionService>(PermissionService);
  for (const { resource, name, target, descriptor } of permissions) {
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
      await permissionService.save({ resource, name, route, method });
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
  const userRepo: UserRepository = app.get<UserRepository>(
    getRepositoryToken(UserRepository, DEFAULT_CONNECTION_NAME),
  );
  const config: AppConfig = app.get<AppConfig>(AppConfig);
  if (
    !(await userRepo.findOneByPhoneOrEmail(config.server.rootAccount.email))
  ) {
    await userService.register({
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
  app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      exitOnError: false,
      transports: [
        new transports.Console({
          format: format.combine(
            // format.colorize(),
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss.SSS A ZZ',
            }),
            // format.ms(),
            format.printf((info) => {
              const { context, level, timestamp, message, ms, ...meta } = info;
              const nestLikeColorScheme: Record<string, bare.Format> = {
                info: clc.green,
                error: clc.red,
                warn: clc.yellow,
                debug: clc.magentaBright,
                verbose: clc.cyanBright,
              };
              const color =
                nestLikeColorScheme[level] || ((text: string): string => text);

              const stringifiedMeta = safeStringify(meta);
              const formattedMeta = inspect(JSON.parse(stringifiedMeta), {
                colors: true,
                depth: null,
              });
              const requestId = rTracer.id();
              return (
                `${clc.yellow(`[Nest Shop]`)} ` +
                // `[${clc.yellow(
                //   level.charAt(0).toUpperCase() + level.slice(1),
                // )}] ` +
                color(`[${level.toUpperCase()}] `) +
                ('undefined' !== typeof timestamp
                  ? clc.green(`[${timestamp}] `)
                  : '') +
                ('undefined' !== typeof context
                  ? `${clc.yellow('[' + context + ']')} `
                  : '') +
                ('undefined' !== typeof requestId
                  ? clc.green(`[request-id: ${requestId}] `)
                  : '') +
                `${color(message)} - ` +
                `${formattedMeta}` +
                ('undefined' !== typeof ms ? ` ${clc.yellow(ms)}` : '')
              );
            }),
          ),
        }),
      ],
    }),
  });
  const config = app.get<AppConfig>(AppConfig);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: false,
  });
  app.use((req, res, next) => {
    req.requestAt = Date.now();
    next();
  });
  app.use(requestIp.mw());
  app.use(session(config.server.session));
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(
    rTracer.expressMiddleware({
      requestIdFactory: () => nanoid(20),
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
      .setTitle('Nest Blog')
      .setDescription('A Blog System')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup(config.swagger.prefix, app, document, config.swagger);

  // logger = app.get<AppLogger>(AppLogger);
  // logger.setContext('Nest Blog');
  // app.useLogger(logger);
  return await app.listen(config.server.port);
}

bootstrap().then(async () => {
  await init(app);
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
