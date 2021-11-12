import { UserPointsLogAction } from '@/points';
import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_amount_log')
@ObjectType('UserAmountLog', {
  description: '用户余额记录',
})
export default class UserAmountLogEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '记录所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => UserPointsLogAction, {
    description: '用户余额操作',
  })
  @Column('tinyint', {
    comment: '用户余额操作',
  })
  action: UserPointsLogAction;

  @Column({
    comment: '增加/减少原因',
  })
  reason: string;

  @Field(() => Int, {
    description: '扣除/获得多少余额',
  })
  @Column('int', {
    comment: '扣除/获得多少余额',
    default: 0,
    unsigned: true,
    name: 'how_much',
  })
  howMuch: number;

  @Field(() => Int, {
    description: '剩余所有可用余额',
  })
  @Column('int', {
    comment: '剩余所有可用余额',
    default: 0,
    unsigned: true,
    name: 'remaining_available',
  })
  remainingAvailable: number;
}
