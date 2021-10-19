import { RedisService } from '@adachi-sakura/nest-shop-common';
import {
  UserEntity,
  UserRegisterDto,
  UserUpdateDto,
} from '@adachi-sakura/nest-shop-entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { RoleService } from '@/role/role.service';
import { createHash } from 'crypto';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
  ) {}

  async findAll() {
    return await this.userRepository.find({});
  }

  async findById(id: string) {
    return this.userRepository.findOne(id);
  }

  async findOneByUsernameOrEmail(username: string) {
    const user = await this.userRepository.findOneByUsernameOrEmail(username);
    if (!user) {
      throw new NotFoundException('用户名或邮箱无效');
    }
    return user;
  }

  register(user: UserRegisterDto) {
    return this.userRepository.register(user);
  }

  async update(
    id: string,
    user:
      | (UserUpdateDto & { articleIds?: string[]; roleIds?: string[] })
      | UserEntity,
  ) {
    const user1 = await this.userRepository.findOne(id);
    if (!user1) throw new BadRequestException('用户id无效');
    if (!(user instanceof UserEntity)) {
      if (!user1.roles) user1.roles = [];
      if (user.roleIds) {
        const roles = await this.roleService.findByIds(user.roleIds);
        user1.roles.push(...roles);
        await this.redisService.set(id + '-roles', user1.roles);
      }
    }
    return await this.userRepository.save(user);
  }

  logout(user: UserEntity, token: string) {
    return this.redisService
      .getClient()
      .set(
        'expired-token-' + createHash('sha1').update(token).digest('hex'),
        token,
        'EX',
        +process.env.JWT_EXPIRES,
      );
  }
}
