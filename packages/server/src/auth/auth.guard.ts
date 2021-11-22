import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') implements CanActivate {
  @InjectRedis()
  private readonly redisService: Redis;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToHttp().getRequest().headers?.authorization;
    if (await this.redisService.sismember('expired-token', token))
      throw new UnauthorizedException('token has expired');
    return super.canActivate(context) as boolean;
  }
}
