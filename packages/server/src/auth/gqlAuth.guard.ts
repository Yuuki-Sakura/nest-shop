import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@/auth/auth.guard';

@Injectable()
export class GqlAuthGuard extends AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx['args'][2]['req'];
    ctx['args'][0] = request;
    ctx['args'][1] = request['res'];
    return super.canActivate(ctx);
  }
}
