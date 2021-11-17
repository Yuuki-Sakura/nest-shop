import CouponEntity from '@/coupon/entity/coupon.entity';
import { UserEntity } from '@/user';
import { CommonEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

//优惠券获取方式
export enum CouponGetMethod {
  Manual, //用户手动领取
  NewUser, //新用户（平台发券时为新注册用户，商户发券为商户首次购买用户）
  Send, //后台发送
  Reward, //满赠
  Buy, //买赠
}

registerEnumType(CouponGetMethod, {
  name: 'CouponGetMethod',
  description: '优惠券获取方式',
  valuesMap: {
    Manual: {
      description: '用户手动领取',
    },
    NewUser: {
      description:
        '新用户（平台发券时为新注册用户，商户发券为商户首次购买用户）',
    },
    Send: {
      description: '后台发送',
    },
    Reward: {
      description: '满赠',
    },
    Buy: {
      description: '买赠',
    },
  },
});

@Entity('user_coupon')
@ObjectType()
export default class UserCouponEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => UserEntity, {
    description: '优惠券',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'coupon_id',
  })
  coupon: CouponEntity;

  @Field(() => CouponGetMethod, {
    description: '优惠券获取方式',
  })
  @Column('tinyint', {
    comment: '优惠券获取方式',
    name: 'get_method',
  })
  getMethod: CouponGetMethod;

  @Field({
    description: '使用时间',
    nullable: true,
  })
  @ApiProperty()
  @Column({
    type: 'timestamp',
    comment: '使用时间',
    name: 'use_at',
    default: null,
    nullable: true,
  })
  @Timestamp()
  useAt?: Date;

  @Field({
    description: '过期时间',
    nullable: true,
  })
  @ApiProperty()
  @Column({
    type: 'timestamp',
    comment: '过期时间',
    name: 'expires_at',
  })
  @Timestamp()
  expiresAt?: Date;
}
