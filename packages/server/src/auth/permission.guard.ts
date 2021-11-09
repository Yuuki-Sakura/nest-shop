// import { RedisService } from '@adachi-sakura/nest-shop-common';
import { Role } from '@adachi-sakura/nest-shop-entity';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission } from '@/auth/auth.utils';
import { RoleService } from '@/role/role.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(RoleService)
    private readonly roleService: RoleService, // private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const permission = this.reflector.get<string>(
      'resource',
      context.getHandler(),
    );
    // 无权限标识的接口，直接通过
    // if (permission) {
    //   // 获取用户角色
    //   const roles =
    //     (await this.redisService.get<Role[]>(request.user.id + '-roles')) ||
    //     (await this.roleService.findByUser(request.user.id));
    //   return hasPermission(permission, roles);
    // }
    return true;
  }
}
