import { Role } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { Redis } from 'ioredis';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly roleService: RoleService;

  @InjectRedis()
  private readonly redis: Redis;

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
    const permissions = JSON.parse(
      await this.redis.get(`user-${request.user.id}-permissions`),
    );
    // return hasPermission(permission, roles);
    return true;
  }
}
