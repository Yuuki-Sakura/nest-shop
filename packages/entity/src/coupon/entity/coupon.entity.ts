import { GoodsSkuEntity } from '@/goods';
import { MerchantEntity } from '@/merchant';
import {
  CommonEntity,
  DecimalTransformer,
  JexlExpression,
  JexlExpressionScalar,
  Timestamp,
  ToDecimal,
} from '@adachi-sakura/nest-shop-common';
import { JexlExpressionTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import Expression from 'jexl/dist/Expression';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('coupon')
@ObjectType('Coupon', {
  description: '优惠券',
})
export class CouponEntity extends CommonEntity {
  @Field(() => MerchantEntity, {
    description: '优惠卷关联商户，若为空则为平台券',
    nullable: true,
  })
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.coupons, {
    nullable: true,
  })
  @JoinColumn({
    name: 'merchant_id',
  })
  merchant?: MerchantEntity;

  @Field({
    description: '优惠券名称',
  })
  @Column('varchar', {
    length: 32,
    comment: '优惠券名称',
  })
  name: string;

  @Field({
    description: '优惠券总量，0为不设限',
  })
  @Column('int', {
    comment: '优惠券总量，0为不设限',
  })
  total: number;

  @Field({
    description: '优惠券剩余数量',
  })
  @Column('int', {
    comment: '优惠券剩余数量',
    default: 0,
  })
  remain: number;

  @Field({
    description: '优惠券面值',
  })
  @ApiProperty({
    description: '优惠券面值',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '优惠券面值',
    unsigned: true,
    precision: 11,
    scale: 2,
    transformer: DecimalTransformer(2),
    nullable: true,
  })
  @ToDecimal()
  parValue: Decimal;

  @Field(() => JexlExpressionScalar, {
    description: '优惠券Jexl表达式',
  })
  @Column('varchar', {
    length: 3000,
    comment: '优惠券Jexl表达式',
    transformer: JexlExpressionTransformer,
  })
  @JexlExpression()
  conditions: Expression;

  @Field(() => GoodsSkuEntity, {
    description: '优惠券商品条件',
    nullable: true,
  })
  @Column('json', {
    comment: '优惠券商品条件',
    name: 'sku_conditions',
  })
  skuConditions: Partial<GoodsSkuEntity>;

  @Field({
    description: '过期时间',
  })
  @Column('timestamp', {
    name: 'get_start_at',
    comment: '可用时间',
  })
  @Timestamp()
  getStartAt: Date;

  @Field({
    description: '过期时间',
  })
  @Column('timestamp', {
    name: 'get_end_at',
    comment: '过期时间',
  })
  @Timestamp()
  getEndAt: Date;

  @Field({
    description: '过期时间',
  })
  @Column('timestamp', {
    name: 'available_at',
    comment: '可用时间',
  })
  @Timestamp()
  availableAt: Date;

  @Field({
    description: '过期时间',
  })
  @Column('timestamp', {
    name: 'expires_at',
    comment: '过期时间',
  })
  @Timestamp()
  expiresAt: Date;
}
