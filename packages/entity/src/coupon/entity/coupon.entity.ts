import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import MerchantEntity from '@/merchant/entity/merchant.entity';
import {
  CommonEntity,
  DecimalTransformer,
  JexlExpression,
  JexlExpressionScalar,
  Timestamp,
} from '@adachi-sakura/nest-shop-common';
import { JexlExpressionTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import Expression from 'jexl/dist/Expression';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

//优惠券领取类型
export enum CouponGetType {
  Manual, //用户手动领取
  NewUser, //新用户（平台发券时为新注册用户，商户发券为商户首次购买用户）
}

registerEnumType(CouponGetType, {
  name: 'CouponGetType',
  description: '优惠券获取类型',
  valuesMap: {
    Manual: {
      description: '用户手动领取',
    },
    NewUser: {
      description:
        '新用户（平台发券时为新注册用户，商户发券为商户首次购买用户）',
    },
  },
});

@Entity('coupon')
@ObjectType('Coupon', {
  description: '优惠券',
})
export default class CouponEntity extends CommonEntity {
  @Field(() => MerchantEntity, {
    description: '优惠卷关联商户，若为空则为平台券',
    nullable: true,
  })
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id, {
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
  })
  remain: number;

  @Field({
    description: '优惠券面值',
  })
  @Column('decimal', {
    comment: '优惠券面值',
    unsigned: true,
    precision: 11,
    scale: 2,
    transformer: DecimalTransformer(2),
    nullable: true,
  })
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

  @Field(() => JexlExpressionScalar, {
    description: '优惠券商品条件',
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
