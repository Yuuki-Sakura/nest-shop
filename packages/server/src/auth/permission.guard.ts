import { UserTempPermission } from '@/auth/auth.utils';
import { Span } from '@/common/decorator/span.decorator';
import { CommonException } from '@adachi-sakura/nest-shop-common';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Redis } from 'ioredis';
import minimatch from 'minimatch';

@Injectable()
@Span()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly roleService: RoleService;

  @InjectRedis()
  private readonly redis: Redis;

  private readonly logger = new Logger('PermissionGuard');

  async canActivate(context: ExecutionContext) {
    const request = this.getRequest(context);
    const permission: string = Reflect.getMetadata(
      'resource',
      context.getHandler(),
    );
    // 无权限标识的接口，直接通过
    if (!permission) {
      return true;
    }
    // 获取用户角色
    const permissions: UserTempPermission[] = JSON.parse(
      await this.redis.get(`user-${request.user.id}-permissions`),
    );
    for (let i = 0; i < permissions.length; i++) {
      if (minimatch(permission, permissions[i].resource)) {
        this.logger.verbose(
          `matching: ${permission} have: ${permissions[i].resource} result: true`,
        );
        return true;
      } else {
        this.logger.verbose(
          `matching: ${permission} have: ${permissions[i].resource} result: false`,
        );
      }
    }
    throw new CommonException(
      {
        key: 'auth.noPermission',
      },
      401,
    );
  }

  getRequest<T = any>(context: ExecutionContext): T {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() === 'graphql') {
      return gqlContext.getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  getResponse<T = any>(context: ExecutionContext): T {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() === 'graphql') {
      return gqlContext.getContext().req.res;
    }
    return context.switchToHttp().getResponse();
  }
}
