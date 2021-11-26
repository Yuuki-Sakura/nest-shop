import { UserPointsLogEntity } from '@/points';
import { UserEntity } from '@/user';
import { CommonEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity('system_points_log')
@ObjectType('SystemPointsLog', {
  description: '系统积分记录',
})
export class SystemPointsLogEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '记录所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @ManyToMany(() => UserPointsLogEntity, (userLog) => userLog.id)
  @JoinTable({
    name: 'system_user_points_log',
    joinColumn: {
      name: 'system_points_log_id',
    },
    inverseJoinColumn: {
      name: 'user_points_log_id',
    },
  })
  userLogs: UserPointsLogEntity[];

  @Field(() => Int, {
    description: '获得积分',
  })
  @Column('int', {
    comment: '获得积分',
    default: 0,
    unsigned: true,
    name: 'get_points',
  })
  getPoints: number;

  @Field(() => Int, {
    description: '剩余可用积分',
  })
  @Column('int', {
    comment: '剩余可用积分',
    default: 0,
    unsigned: true,
  })
  available: number;

  @Field({
    description: '过期时间',
  })
  @Column('timestamp', {
    name: 'expires_at',
    comment: '过期时间',
    nullable: true,
  })
  @Timestamp()
  expiresAt?: Date;
}
