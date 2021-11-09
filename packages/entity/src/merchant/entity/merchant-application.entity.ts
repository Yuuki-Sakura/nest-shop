import { UserEntity } from '@/user';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('merchant_application')
@ObjectType('MerchantApplication', {
  description: '商户申请信息',
})
export default class MerchantApplicationEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;
}
