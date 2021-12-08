import { UserCouponEntity } from '@/coupon/entity/user-coupon.entity';
import { OrderEntity, PayMethod, PayStatus } from '@/order/entity/order.entity';
import { UserEntity } from '@/user';
import {
  CommonEntity,
  generateSn,
  OrderPrefixEnum,
  Timestamp,
  ToDecimal,
} from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
@Entity('order_group')
@ObjectType('OrderGroup', {
  description: '订单组(用于支付)',
})
export class OrderGroupEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '订单组所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => [OrderEntity], {
    description: '子订单',
  })
  @OneToMany(() => OrderEntity, (order) => order.id)
  order: OrderEntity[];

  @Field({
    description: '订单编号',
  })
  @Column('varchar', {
    length: 20,
    comment: '订单组编号',
  })
  sn: string = generateSn(OrderPrefixEnum.GroupOrder);

  @Field({
    description: '订单总价',
  })
  @ApiProperty({
    description: '订单总价',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '订单总价',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'total_price',
    transformer: DecimalTransformer(),
  })
  @ToDecimal()
  totalPrice: Decimal;

  @Field({
    description: '总运费',
  })
  @ApiProperty({
    description: '总运费',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '总运费',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'freight',
    transformer: DecimalTransformer(),
  })
  @ToDecimal()
  freight: Decimal;

  @Field(() => Int, {
    description: '使用积分数量',
  })
  @Column('int', {
    comment: '使用积分数量',
    unsigned: true,
    name: 'use_points',
  })
  usePoints: number;

  @Field({
    description: '使用积分抵扣金额',
  })
  @ApiProperty({
    description: '使用积分抵扣金额',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '使用积分抵扣金额',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'use_points_amount',
    transformer: DecimalTransformer(2),
  })
  @ToDecimal()
  usePointsAmount: Decimal;

  @Field(() => PayMethod, {
    description: '支付方式',
    nullable: true,
  })
  @Column('smallint', {
    comment: '支付方式',
    nullable: true,
    name: 'pay_method',
  })
  payMethod: PayMethod;

  @Field({
    description: '支付时间',
    nullable: true,
  })
  @Column('timestamp', {
    comment: '支付时间',
    nullable: true,
    name: 'pay_at',
  })
  @Timestamp()
  payAt: Date;

  @Field(() => PayStatus, {
    description: '支付状态',
    nullable: true,
  })
  @Column('smallint', {
    comment: '支付状态',
    nullable: true,
    name: 'pay_status',
  })
  payStatus: PayStatus;

  @Field({
    description: '实际支付金额',
  })
  @ApiProperty({
    description: '实际支付金额',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '实际支付金额',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'pay_amount',
    transformer: DecimalTransformer(2),
  })
  @ToDecimal()
  payAmount: Decimal;

  @Field(() => UserCouponEntity, {
    description: '订单组使用优惠券',
  })
  @ManyToMany(() => UserCouponEntity, (coupon) => coupon.id)
  @JoinTable({
    name: 'order_group_coupons',
    joinColumn: {
      name: 'order_group_id',
    },
    inverseJoinColumn: {
      name: 'user_coupon_id',
    },
  })
  coupons: UserCouponEntity[];
}
