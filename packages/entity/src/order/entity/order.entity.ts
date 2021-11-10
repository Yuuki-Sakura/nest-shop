import OrderAddressEntity from '@/address/entity/order-address.entity';
import MerchantEntity from '@/merchant/entity/merchant.entity';
import OrderGroupEntity from '@/order/entity/order-group.entity';
import { UserEntity } from '@/user';
import {
  BaseEntity,
  generateSn,
  OrderPrefixEnum,
  Timestamp,
} from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum PayMethod {
  Balance, //余额
  WeChatAppPay, //微信APP支付
  WeChatWebPay, //微信网页支付
  WeChatQrCodePay, //微信小程序支付
  WeChatMiniProgramPay, //微信小程序支付
  AliPayAppPay, //支付宝APP支付
  AliPayWebPay, //支付宝PC网页支付
  AliPayWapPay, //支付宝手机网页支付
  AliPayQrCodePay, //支付宝当面付
  AliPayMiniProgramPay, //支付宝小程序支付
}

@Entity('order')
@ObjectType('Order', {
  description: '订单',
})
export default class OrderEntity extends BaseEntity {
  @Field(() => OrderGroupEntity, {
    description: '所属订单组',
  })
  @ManyToOne(() => OrderGroupEntity, (group) => group.id)
  @JoinColumn({
    name: 'order_group_id',
  })
  group: OrderGroupEntity;

  @Field(() => MerchantEntity, {
    description: '订单所属商户',
  })
  @ManyToOne(() => MerchantEntity, (merchant) => merchant.id)
  @JoinColumn({
    name: 'merchant_id',
  })
  merchant: MerchantEntity;

  @Field(() => UserEntity, {
    description: '订单关联用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => OrderAddressEntity, {
    description: '订单关联地址',
  })
  @OneToOne(() => OrderAddressEntity, (address) => address.id)
  @JoinColumn({
    name: 'order_address_id',
  })
  address: OrderAddressEntity;

  @Field({
    description: '订单编号',
  })
  @Column('varchar', {
    length: 20,
    comment: '订单编号',
  })
  sn: string = generateSn(OrderPrefixEnum.Order);

  @Field(() => Int, {
    description: '商品总数',
  })
  @Column('int', {
    comment: '商品总数',
    unsigned: true,
  })
  allQuantity: number;

  @Field({
    description: '商品总价',
  })
  @Column('decimal', {
    comment: '商品总价',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'total_price',
  })
  totalPrice: string;

  @Field({
    description: '运费',
  })
  @Column('decimal', {
    comment: '运费',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'total_price',
  })
  freight: string;

  @Field({
    description: '订单用户备注',
  })
  @Column('varchar', {
    length: 512,
    comment: '订单用户备注',
  })
  remark: string;

  @Field({
    description: '支付方式',
  })
  @Column('tinyint')
  payMethod: PayMethod;

  @Field({
    description: '支付时间',
    nullable: true,
  })
  @Column('timestamp', {
    comment: '支付时间',
    nullable: true,
  })
  @Timestamp()
  payAt: Date;
}
