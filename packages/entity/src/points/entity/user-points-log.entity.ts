import { UserEntity } from '@/user';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_points_log')
@ObjectType('UserPointsLog', {
  description: '用户积分记录',
})
export default class UserPointsLogEntity extends BaseEntity {
  @Field(() => UserEntity, {
    description: '记录所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;
}
