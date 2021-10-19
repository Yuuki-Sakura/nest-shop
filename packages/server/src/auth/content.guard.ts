import { CanActivate, ExecutionContext } from '@nestjs/common';
import { hasContentPermission } from '@/auth/auth.utils';

export class ContentGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let keys: string | string[] = Reflect.getMetadata(
      'keys',
      context.getHandler(),
    );
    const resource = Reflect.getMetadata('resource', context.getHandler());
    if (typeof keys === 'string') {
      keys = [keys];
    }
    let hasPermission = false;
    for (const key of keys) {
      if (
        hasContentPermission(
          request.user[key] || [],
          resource,
          request.user,
          request.user[key] instanceof Array
            ? request.user[key].id
            : request.params.id,
        )
      )
        hasPermission = true;
    }
    return hasPermission;
  }
}
