import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@Injectable()
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOneByPhoneOrEmail(phoneOrEmail: string) {
    return await this.createQueryBuilder('user')
      .where('user.phone = :phoneOrEmail', { phoneOrEmail })
      .orWhere('user.email = :phoneOrEmail', { phoneOrEmail })
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.role', 'role')
      .leftJoinAndSelect('role.extends', 'role_extends')
      .leftJoinAndSelect('role.permissions', 'role_permissions')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .getOne();
  }
}
