import { UserEntity } from '@/user';
import { BaseEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('system_points_log')
@ObjectType('SystemPointsLog', {
  description: '系统积分记录',
})
export default class PointsLogEntity extends BaseEntity {
  @Field(() => UserEntity, {
    description: '记录所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field({
    description: '过期时间',
  })
  @Timestamp({
    name: 'expires_at',
    comment: '过期时间',
    nullable: true,
  })
  expiresAt?: Date;
}
