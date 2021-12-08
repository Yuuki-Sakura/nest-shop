import { Span } from '@/common/decorator/span.decorator';
import { UserPaginateConfig } from '@/user/paginate-config';
import {
  paginate,
  Paginated,
  PaginateQuery,
} from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';

@Injectable()
@Span()
export class UserService {
  @Inject()
  private readonly userRepository: UserRepository;

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
