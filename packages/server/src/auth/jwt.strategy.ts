import { AppConfig } from '@/app.config';
import { HttpUnauthorizedException } from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
      secretOrKey: appConfig.jwt.secret,
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    const { username, password } = payload;
    const user = await this.userService.findOneByUsernameOrEmail(username);
    if (user.password != password) {
      throw new HttpUnauthorizedException();
    }
    return user;
  }
}
