import { UserEntity } from '@/user';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_amount_log')
@ObjectType('UserAmountLog', {
  description: '用户余额记录',
})
export default class UserAmountLogEntity extends BaseEntity {
  @Field(() => UserEntity, {
    description: '记录所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;
}
