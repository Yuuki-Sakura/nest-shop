import { AppConfig } from '@/app.config';
import clc from 'cli-color';
import bare from 'cli-color/bare';
import safeStringify from 'fast-safe-stringify';
import {
  utilities,
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
} from 'nest-winston';
import { inspect } from 'util';
import { format, transports } from 'winston';
import { AppModule } from './app.module';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { environment } from '@/app.environment';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ValidationPipe } from '@/common/pipes/validation.pipe';
import rTracer from 'cls-rtracer';
import { nanoid } from '@adachi-sakura/nest-shop-common/dist';
let logger;
export let app: NestApplication;

// async function init(app: NestApplication) {
//   const permissionService: PermissionService =
//     app.get<PermissionService>(PermissionService);
//   for (const { resource, name, target, descriptor } of permissions) {
//     const route = (() => {
//       let controllerPath: string = Reflect.getMetadata(
//           'path',
//           target.constructor,
//         ),
//         methodPath: string = Reflect.getMetadata('path', descriptor.value);
//       if (!controllerPath) {
//         return;
//       }
//       if (controllerPath.charAt(0) !== '/')
//         controllerPath = '/' + controllerPath;
//       if (controllerPath.charAt(controllerPath.length - 1) !== '/')
//         controllerPath = controllerPath + '/';
//       if (methodPath.charAt(0) === '/') methodPath = methodPath.slice(1);
//       return controllerPath + methodPath;
//     })();
//     const method: TMethod = RequestMethod[
//       Reflect.getMetadata('method', descriptor.value)
//     ] as TMethod;
//     if (!(await permissionService.findOne({ resource })))
//       await permissionService.save({ resource, name, route, method });
//   }
//
//   //添加AdminRole
//   const roleService: RoleService = app.get<RoleService>(RoleService);
//   const permissionIds = await (async () => {
//     const perms = await permissionService.findAll();
//     const ids: string[] = [];
//     perms.forEach((permission) => {
//       ids.push(permission.id);
//     });
//     return ids;
//   })();
//   const adminRole =
//     ((await roleService.findOneByName('admin')) &&
//       (await roleService.update((await roleService.findOneByName('admin')).id, {
//         permissionIds,
//       }))) ||
//     (await roleService.save({
//       name: 'admin',
//       permissionIds,
//     }));
//
//   //创建管理员用户
//   const userService: UserService = app.get<UserService>(UserService);
//   const user = await (async function () {
//     try {
//       return await userService.findOneByUsernameOrEmail('admin');
//     } catch (e) {
//       return await userService.register({
//         username: process.env.ADMIN_USERNAME,
//         email: process.env.ADMIN_EMAIL,
//         password: process.env.ADMIN_PASSWORD,
//       });
//     }
//   })();
//   user.roles = [adminRole];
//   await userService.update(user.id, user);
//   return;
// }

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
  logger = app.get(Logger);
  const config = app.get<AppConfig>(AppConfig);
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
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    // new LoggingInterceptor(logger),
    new ClassSerializerInterceptor(new Reflector()),
  );
  app.useGlobalPipes(new ValidationPipe());
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
  await app.listen(config.server.port);
}

bootstrap().then(async () => {
  const config = app.get<AppConfig>(AppConfig);
  // await init(app);
  logger.log(
    `Nest Blog Run！at http://localhost:${
      config.server.port + config.server.prefix
    } env:${environment}`,
  );
  logger.log(
    `Swagger is running at http://localhost:${
      config.server.port + config.swagger.prefix
    }`,
  );
  logger.log(
    `GraphQL is running at http://localhost:${
      config.server.port + config.server.prefix + config.graphql.path
    }`,
  );
});
