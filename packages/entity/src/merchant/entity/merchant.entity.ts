import MerchantAddressEntity from '@/address/entity/merchant-address.entity';
import CouponEntity from '@/coupon/entity/coupon.entity';
import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import GoodsSpuEntity from '@/goods/entity/goods-spu.entity';
import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import { GraphQLString } from 'graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum MerchantType {
  Personal, //个人普通店铺
  Company, //企业认证店铺
  Flagship, //品牌旗舰店
  DirectSale, //平台自营店
}

export enum MerchantStatus {
  Banned = -1, //平台封禁
  Normal, //正常
  Closed, //商家主动关闭
}

registerEnumType(MerchantType, {
  name: 'MerchantType',
  description: '商户类型',
  valuesMap: {
    Personal: {
      description: '个人普通店铺',
    },
    Company: {
      description: '企业认证店铺',
    },
    Flagship: {
      description: '品牌旗舰店',
    },
    DirectSale: {
      description: '平台自营店',
    },
  },
});

registerEnumType(MerchantStatus, {
  name: 'MerchantStatus',
  description: '商户状态',
  valuesMap: {
    Banned: {
      description: '平台封禁',
    },
    Normal: {
      description: '正常',
    },
    Closed: {
      description: '商家主动关闭',
    },
  },
});

@Entity('merchant')
@ObjectType('Merchant', {
  description: '商户信息',
})
export default class MerchantEntity extends CommonEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @ApiProperty()
  @Field({
    description: '商户名称',
  })
  @Column({
    comment: '商户名称',
  })
  name: string;

  @Field(() => MerchantAddressEntity, {
    description: '商户地址',
  })
  @OneToOne(() => MerchantAddressEntity, (address) => address.merchant)
  @JoinColumn({
    name: 'address_id',
  })
  address: MerchantAddressEntity;

  @ApiProperty()
  @Field(() => MerchantType, {
    description: '商户类型',
  })
  @Column('tinyint', {
    comment: '商户类型',
  })
  type: MerchantType;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '商户资质图片',
  })
  @Column('simple-json', {
    comment: '商户资质图片',
    name: 'qualification_images',
  })
  qualificationImages: string[];

  @ApiProperty()
  @Field({
    description: '联系人姓名',
  })
  @Column({ comment: '联系人姓名', name: 'real_name' })
  realName: string;

  @ApiProperty()
  @Field({
    description: '联系人电话',
  })
  @Column({ comment: '联系人电话', unique: true })
  phone: string;

  @ApiProperty()
  @Field({
    description: '商户简介',
  })
  @Column({
    comment: '商户简介',
    default: '',
  })
  summary: string;

  @ApiProperty()
  @Field({
    description: '商户头像',
  })
  @Column({ length: 500, default: '', comment: '头像' })
  avatar: string;

  @ApiProperty()
  @Field(() => Int, {
    description: '商品销量',
  })
  @Column('int', {
    unsigned: true,
    comment: '商品销量',
    default: 0,
  })
  sales: number;

  @ApiProperty()
  @Field({
    description: '商户交易手续费率',
  })
  @Column('decimal', {
    comment: '商户交易手续费率',
    unsigned: true,
    precision: 11,
    scale: 4,
    name: 'handling_fee',
    transformer: DecimalTransformer(4),
  })
  handlingFee: Decimal;

  @ApiProperty()
  @Field({
    description: '商户保证金',
  })
  @Column('decimal', {
    comment: '商户保证金',
    unsigned: true,
    precision: 11,
    scale: 2,
    transformer: DecimalTransformer(),
  })
  guarantee: Decimal;

  @ApiProperty()
  @Field({
    description: '商户余额',
  })
  @Column('decimal', {
    comment: '商户余额',
    unsigned: true,
    precision: 12,
    scale: 2,
    transformer: DecimalTransformer(),
  })
  money: Decimal;

  @ApiProperty()
  @Field(() => MerchantStatus, {
    description: '商户状态',
  })
  @Column('tinyint', {
    default: MerchantStatus.Normal,
    comment: '商户状态',
  })
  status: MerchantStatus;

  @ApiProperty()
  @Field(() => Int, {
    description: '商户用户关注数',
  })
  @Column('int', {
    unsigned: true,
    comment: '商户用户关注数',
    default: 0,
    name: 'follow_count',
  })
  followCount: number;

  @ApiProperty()
  @Field({
    description: '商户商品评分',
  })
  @Column('decimal', {
    comment: '商户商品评分',
    unsigned: true,
    precision: 5,
    scale: 2,
    name: 'product_ratings',
    transformer: DecimalTransformer(),
  })
  productRatings: Decimal;

  @ApiProperty()
  @Field({
    description: '商户服务评分',
  })
  @Column('decimal', {
    comment: '商户服务评分',
    unsigned: true,
    precision: 5,
    scale: 2,
    name: 'service_ratings',
    transformer: DecimalTransformer(),
  })
  serviceRatings: Decimal;

  @ApiProperty()
  @Field({
    description: '商户物流评分',
  })
  @Column('decimal', {
    comment: '商户物流评分',
    unsigned: true,
    precision: 5,
    scale: 2,
    name: 'logistics_ratings',
    transformer: DecimalTransformer(),
  })
  logisticsRatings: Decimal;

  @Field(() => [CouponEntity])
  @OneToMany(() => CouponEntity, (coupon) => coupon.id)
  coupons: CouponEntity[];

  @Field(() => GoodsSpuEntity, {
    description: '商家spu',
  })
  @OneToMany(() => GoodsSpuEntity, (spu) => spu.merchant)
  goodsSpu: GoodsSpuEntity[];

  @Field(() => GoodsSkuEntity, {
    description: '商家sku',
  })
  @OneToMany(() => GoodsSkuEntity, (sku) => sku.merchant)
  goodsSku: GoodsSkuEntity[];
}
