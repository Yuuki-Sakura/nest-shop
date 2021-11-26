import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOneByPhoneOrEmail(
    phone: string,
    email: string,
  ): Promise<UserEntity | undefined>;
  async findOneByPhoneOrEmail(
    phoneOrEmail: string,
  ): Promise<UserEntity | undefined>;
  async findOneByPhoneOrEmail(phoneOrEmail: string, email?: string) {
    return await this.createQueryBuilder('user')
      .where('user.phone = :phoneOrEmail', { phoneOrEmail })
      .orWhere('user.email = :email', { email: email || phoneOrEmail })
      .getOne();
  }
}
