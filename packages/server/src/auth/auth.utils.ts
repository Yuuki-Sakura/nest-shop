import { Permission as PermissionEntity } from '@adachi-sakura/nest-shop-entity';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { PermissionGuard } from '@/auth/permission.guard';
import { GqlAuthGuard } from '@/auth/gqlAuth.guard';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

export function encryptPassword(password: string) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return argon2.hash(
    hash.substring(0, hash.length / 2) +
      password +
      hash.substring(hash.length / 2, hash.length),
  );
}

export function verifyPassword(hashPwd: string, password: string) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return argon2.verify(
    hashPwd,
    hash.substring(0, hash.length / 2) +
      password +
      hash.substring(hash.length / 2, hash.length),
  );
}

export const getPermissions = async (
  user: UserEntity,
  moduleRef: ModuleRef,
): Promise<PermissionEntity[]> => {
  let permissions: PermissionEntity[];
  return permissions;
};

export const Auth = (resource?: string, name?: string) => {
  if (resource) {
    return applyDecorators(
      ApiBearerAuth(),
      UseGuards(AuthGuard, PermissionGuard),
      Permission(resource, name),
    );
  } else return applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard));
};

export const GqlAuth = (resource?: string, name?: string) => {
  if (resource) {
    return applyDecorators(
      UseGuards(GqlAuthGuard, PermissionGuard),
      Permission('gql.' + resource, name),
    );
  } else return applyDecorators(UseGuards(GqlAuthGuard, PermissionGuard));
};

export const permissions: {
  name: string;
  resource: string;
  target: object;
  descriptor: TypedPropertyDescriptor<any>;
}[] = [];

export const Permission = (resource: string, name?: string) => {
  return applyDecorators(
    SetMetadata('resource', resource),
    (target, propertyKey, descriptor) => {
      permissions.push({ resource, name, target, descriptor });
    },
  );
};

export const GetPermission = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return Reflect.getMetadata('resource', ctx.getHandler());
  },
);

export { GetPermission as Perm };

export const User = (required = true) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user && required) throw new UnauthorizedException('请登录');
    return request.user;
  })();

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const token = ctx.switchToHttp().getRequest().headers?.authorization;
    if (!token) {
      throw new UnauthorizedException('请登录');
    }
    return token;
  },
);
