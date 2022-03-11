import { AppConfig } from '@/app.config';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly appConfig: AppConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.server.security.jwt.secret,
    });
  }

  async validate(payload: { id: string }): Promise<UserEntity> {
    const { id } = payload;
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
