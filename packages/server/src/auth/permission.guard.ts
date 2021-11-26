import { UserTempPermission } from '@/auth/auth.utils';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { Redis } from 'ioredis';
import minimatch from 'minimatch';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly roleService: RoleService;

  @InjectRedis()
  private readonly redis: Redis;

  private readonly logger = new Logger('PermissionGuard');

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
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
    return false;
  }
}
