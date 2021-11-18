import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum UserAmountLogAction {
  Deductions, //扣除
  Increase, //增加
}

registerEnumType(UserAmountLogAction, {
  name: 'UserPointsLogAction',
  description: '用户积分操作',
  valuesMap: {
    Deductions: {
      description: '用户操作扣除',
    },
    Increase: {
      description: '增加',
    },
  },
});

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

  @Field(() => UserAmountLogAction, {
    description: '用户余额操作',
  })
  @Column('smallint', {
    comment: '用户余额操作',
  })
  action: UserAmountLogAction;

  @Column({
    comment: '增加/减少原因',
  })
  reason: string;

  @Field(() => Int, {
    description: '扣除/获得多少余额',
  })
  @Column('decimal', {
    comment: '扣除/获得多少余额',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'how_much',
  })
  howMuch: number;

  @Field(() => Int, {
    description: '剩余所有可用余额',
  })
  @Column('decimal', {
    comment: '剩余所有可用余额',
    precision: 11,
    scale: 2,
    unsigned: true,
    name: 'remaining_available',
  })
  remainingAvailable: number;
}
