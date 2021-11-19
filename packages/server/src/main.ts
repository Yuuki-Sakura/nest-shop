import { AppConfig } from '@/app.config';
import { AppModule } from './app.module';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { environment } from '@/app.environment';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ValidationPipe } from '@/common/pipes/validation.pipe';
import { AppLogger } from '@/app.logger';
let logger;
let app: NestApplication;

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
  app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(compression());
  app.useGlobalInterceptors(
    new TransformInterceptor(new Reflector()),
    // new LoggingInterceptor(logger),
    new ClassSerializerInterceptor(new Reflector()),
  );
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get<AppConfig>(AppConfig);
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
  console.log(
    `Nest Blog Run！at http://localhost:${
      config.server.port + config.server.prefix
    } env:${environment}`,
  );
  console.log(
    `Swagger is running at http://localhost:${
      config.server.port + config.swagger.prefix
    }`,
  );
  console.log(
    `GraphQL is running at http://localhost:${
      config.server.port + config.server.prefix + config.graphql.path
    }`,
  );
});
