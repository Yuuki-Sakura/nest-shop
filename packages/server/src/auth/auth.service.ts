import { RedisService } from '@adachi-sakura/nest-shop-common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { RoleService } from '@/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
  ) {}

  // async validateUser(username: string, password: string): Promise<UserEntity> {
  //   const user = await this.userService.findOneByUsernameOrEmail(username);
  //   if (!(await verifyPassword(user.password, password)))
  //     throw new BadRequestException('用户名或密码错误');
  //   return user;
  // }
  //
  // async certificate(user: UserEntity) {
  //   const { username, password, roles, id } = user;
  //   if (roles)
  //     await this.redisService.set(
  //       id + '-roles',
  //       await this.roleService.findByUser(user.id),
  //     );
  //   user.loginAt = new Date();
  //   await this.userService.update(user.id, user);
  //   return this.jwtService.sign({ username, password });
  // }
}
