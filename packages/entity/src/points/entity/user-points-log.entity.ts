import SystemPointsLogEntity from '@/points/entity/system-points-log.entity';
import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

export enum UserPointsLogAction {
  Expired = -1, //过期
  Deductions, //扣除
  Increase, //增加
}

registerEnumType(UserPointsLogAction, {
  name: 'UserPointsLogAction',
  description: '用户积分操作',
  valuesMap: {
    Expired: {
      description: '积分过期扣除',
    },
    Deductions: {
      description: '用户操作扣除',
    },
    Increase: {
      description: '增加',
    },
  },
});

@Entity('user_points_log')
@ObjectType('UserPointsLog', {
  description: '用户积分记录',
})
export default class UserPointsLogEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '记录所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => [SystemPointsLogEntity], {
    description: '扣除系统记录',
  })
  @ManyToMany(() => SystemPointsLogEntity, (sysLog) => sysLog.id)
  systemLogs: SystemPointsLogEntity[];

  @Field(() => UserPointsLogAction, {
    description: '用户积分操作',
  })
  @Column('smallint', {
    comment: '用户积分操作',
  })
  action: UserPointsLogAction;

  @Column({
    comment: '增加/减少原因',
  })
  reason: string;

  @Field(() => Int, {
    description: '扣除/获得/过期多少积分',
  })
  @Column('int', {
    comment: '扣除/获得/过期多少积分',
    default: 0,
    unsigned: true,
    name: 'how_much',
  })
  howMuch: number;

  @Field(() => Int, {
    description: '剩余所有可用积分',
  })
  @Column('int', {
    comment: '剩余所有可用积分',
    default: 0,
    unsigned: true,
    name: 'remaining_available',
  })
  remainingAvailable: number;
}
