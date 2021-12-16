import { Span } from '@/common/decorator/span.decorator';
import { create } from '@/common/utils/create.util';
import { AuthEnableOtpStep2ResultDto } from '@/auth/dto/otp/auth-enable-otp-step-2-result.dto';
import { AuthEnableOtpStep2Dto } from '@/auth/dto/otp/auth-enable-otp-step-2.dto';
import { AuthEnableOtpStep1ResultDto } from '@/auth/dto/otp/auth-enable-otp-step-1-result.dto';
import { UserPaginateConfig } from '@/user/paginate-config';
import {
  CommonException,
  paginate,
  Paginated,
  PaginateQuery,
} from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { Redis } from 'ioredis';
@Injectable()
@Span()
export class UserService {
  @Inject()
  private readonly userRepository: UserRepository;

  @InjectRedis()
  private readonly redis: Redis;

  async findById(id: string) {
    return this.userRepository.findOne(id);
  }

  async find(query: PaginateQuery = {}): Promise<Paginated<UserEntity>> {
    return paginate<UserEntity>(
      query,
      this.userRepository,
      UserPaginateConfig.find,
    );
  }

  async findOneByPhoneOrEmail(phoneOrEmail: string) {
    const user = await this.userRepository.findOneByPhoneOrEmail(phoneOrEmail);
    if (!user) {
      throw new NotFoundException('手机号或邮箱无效');
    }
    return user;
  }
}
