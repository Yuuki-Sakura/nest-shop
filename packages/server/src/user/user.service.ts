import { AuthService } from '@/auth/auth.service';
import { encryptPassword, verifyPassword } from '@/auth/auth.utils';
import { create } from '@/common/utils/create.util';
import { UserLoginDto, UserLoginResultDto, UserRegisterDto } from '@/user/dto';
import { CommonException } from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { RoleService } from '@/role/role.service';
import { Redis } from 'ioredis';

@Injectable()
export class UserService {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(RoleService)
  private readonly roleService: RoleService;

  @InjectRedis()
  private readonly redis: Redis;

  async findAll() {
    return await this.userRepository.find({});
  }

  async findById(id: string) {
    return this.userRepository.findOne(id);
  }

  async findOneByPhoneOrEmail(phoneOrEmail: string) {
    const user = await this.userRepository.findOneByPhoneOrEmail(phoneOrEmail);
    if (!user) {
      throw new NotFoundException('手机号或邮箱无效');
    }
    return user;
  }

  async login({ phoneOrEmail, password }: UserLoginDto) {
    const user = await this.findOneByPhoneOrEmail(phoneOrEmail);
    if (!(await verifyPassword(user.password, password))) {
      throw new CommonException(
        { key: 'user.login.accountOrPasswordFail' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = this.authService.signToken(user);
    return create(UserLoginResultDto, { ...user, token });
  }

  async register(registerDto: UserRegisterDto): Promise<void> {
    if (registerDto.phone && registerDto.email) {
    }
    const password = await encryptPassword(registerDto.password);
    const result = await this.userRepository.save(
      this.userRepository.create({ ...registerDto, password }),
    );
    if (!result) {
      throw new CommonException({ key: 'user.register.fail' });
    }
  }

  logout(user: UserEntity, token: string) {
    return this.redis.zadd('expired-token', Date.now(), token);
  }
}
