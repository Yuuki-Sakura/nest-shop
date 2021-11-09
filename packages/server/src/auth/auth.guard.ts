import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') implements CanActivate {
  // @Inject(RedisService)
  // private readonly redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context
      .switchToHttp()
      .getRequest()
      .headers?.authorization?.split(' ')[1];
    // if (
    //   await this.redisService.get(
    //     'expired-token-' + createHash('sha1').update(token).digest('hex'),
    //   )
    // )
    //   throw new UnauthorizedException('token has expired');
    return super.canActivate(context) as boolean;
  }
}
