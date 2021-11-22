import { AuthService } from '@/auth/auth.service';
import { verifyPassword } from '@/auth/auth.utils';
import { create } from '@/common/utils/create.util';
import { UserLoginDto, UserLoginResultDto } from '@/user/dto';
import { CommonException } from '@adachi-sakura/nest-shop-common';
import {
  UserEntity,
  UserRegisterDto,
  UserUpdateDto,
} from '@adachi-sakura/nest-shop-entity';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { RoleService } from '@/role/role.service';

@Injectable()
export class UserService {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(RoleService)
  private readonly roleService: RoleService;

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
        // user1.roles.push(...roles);
        // await this.redisService.set(id + '-roles', user1.roles);
      }
    }
    return await this.userRepository.save(user);
  }

  async login({ usernameOrEmail, password }: UserLoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :usernameOrEmail', { usernameOrEmail })
      .orWhere('user.email = :usernameOrEmail', { usernameOrEmail })
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.role', 'role')
      .leftJoinAndSelect('role.extends', 'role_extends')
      .leftJoinAndSelect('role.permissions', 'role_permissions')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .getOne();
    if (!user) {
      throw new CommonException('用户名或邮箱无效', HttpStatus.NOT_FOUND);
    }
    if (!(await verifyPassword(user.password, password))) {
      throw new CommonException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    const token = this.authService.signToken(user);
    return create(UserLoginResultDto, { ...user, token });
  }

  register(user: UserRegisterDto) {
    return this.userRepository.register(user);
  }

  logout(user: UserEntity, token: string) {
    // return this.redisService
    //   .getClient()
    //   .set(
    //     'expired-token-' + createHash('sha1').update(token).digest('hex'),
    //     token,
    //     'EX',
    //     +process.env.JWT_EXPIRES,
    //   );
  }
}
