import OrderAddressEntity from '@/address/entity/order-address.entity';
import UserCouponEntity from '@/coupon/entity/user-coupon.entity';
import MerchantEntity from '@/merchant/entity/merchant.entity';
import OrderDeliveryInfoEntity from '@/order/entity/order-delivery-info.entity';
import OrderGroupEntity from '@/order/entity/order-group.entity';
import OrderInvoiceEntity from '@/order/entity/order-invoice.entity';
import { UserEntity } from '@/user';
import {
  CommonEntity,
  generateSn,
  OrderPrefixEnum,
  Timestamp,
} from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

//支付方式
export enum PayMethod {
  Balance, //余额
  WeChatAppPay, //微信APP支付
  WeChatWebPay, //微信网页支付
  WeChatQrCodePay, //微信二维码支付
  WeChatMiniProgramPay, //微信小程序支付
  AliPayAppPay, //支付宝APP支付
  AliPayWebPay, //支付宝PC网页支付
  AliPayWapPay, //支付宝手机网页支付
  AliPayQrCodePay, //支付宝当面付
  AliPayMiniProgramPay, //支付宝小程序支付
  UnionPay, //银联/云闪付支付
}

//支付状态
export enum PayStatus {
  Refund = -2, //转入退款
  Closed, //超时关闭
  NotPay, //等待支付
  Success, //支付成功
}

//订单状态
export enum OrderStatus {
  Refund = -2, //已退款
  Canceled, //已取消
  NotPay, //待支付
  BeingProcessed, //订单处理中
  Dispatched, //商家已发出
  PendingEvaluation, //待评价
  Completed, //订单已完成
}

registerEnumType(PayMethod, {
  name: 'PayMethod',
  description: '支付方式',
  valuesMap: {
    Balance: {
      description: '余额',
    },
    WeChatAppPay: {
      description: '微信APP支付',
    },
    WeChatWebPay: {
      description: '微信网页支付',
    },
    WeChatQrCodePay: {
      description: '微信二维码支付',
    },
    WeChatMiniProgramPay: {
      description: '微信小程序支付',
    },
    AliPayAppPay: {
      description: '支付宝APP支付',
    },
    AliPayWebPay: {
      description: '支付宝PC网页支付',
    },
    AliPayWapPay: {
      description: '支付宝手机网页支付',
    },
    AliPayQrCodePay: {
      description: '支付宝当面付',
    },
    AliPayMiniProgramPay: {
      description: '支付宝小程序支付',
    },
    UnionPay: {
      description: '银联/云闪付支付',
    },
  },
});

registerEnumType(PayStatus, {
  name: 'PayStatus',
  description: '支付状态',
  valuesMap: {
    Refund: {
      description: '转入退款',
    },
    Closed: {
      description: '超时关闭',
    },
    NotPay: {
      description: '等待支付',
    },
    Success: {
      description: '支付成功',
    },
  },
});

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: '订单状态',
  valuesMap: {
    Refund: {
      description: '已退款',
    },
    Canceled: {
      description: '已取消',
    },
    NotPay: {
      description: '等待支付',
    },
    BeingProcessed: {
      description: '订单处理中',
    },
    Dispatched: {
      description: '商家已发出',
    },
    PendingEvaluation: {
      description: '待评价',
    },
    Completed: {
      description: '订单已完成',
    },
  },
});

@Entity('order')
@ObjectType('Order', {
  description: '订单',
})
export default class OrderEntity extends CommonEntity {
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
    description: '订单所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => OrderAddressEntity, {
    description: '订单关联地址',
  })
  @OneToOne(() => OrderAddressEntity, (address) => address.id, {
    eager: true,
  })
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
    name: 'all_quantity',
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
    transformer: DecimalTransformer(2),
  })
  totalPrice: Decimal;

  @Field({
    description: '运费',
  })
  @Column('decimal', {
    comment: '运费',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'freight',
    transformer: DecimalTransformer(2),
  })
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
  @Column('decimal', {
    comment: '使用积分抵扣金额',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'use_points_amount',
    transformer: DecimalTransformer(2),
  })
  usePointsAmount: Decimal;

  @Field({
    description: '订单用户备注',
  })
  @Column('varchar', {
    length: 512,
    comment: '订单用户备注',
  })
  remark: string;

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
  @Column('decimal', {
    comment: '实际支付金额',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'pay_amount',
    transformer: DecimalTransformer(2),
  })
  payAmount: Decimal;

  @Field(() => OrderStatus, {
    description: '订单状态',
  })
  @Column('smallint', {
    comment: '订单状态',
    name: 'status',
  })
  status: OrderStatus;

  @Field(() => OrderDeliveryInfoEntity, {
    description: '订单发货信息',
  })
  @OneToMany(() => OrderDeliveryInfoEntity, (deliveryInfo) => deliveryInfo.id, {
    nullable: true,
    eager: true,
  })
  deliveryInfo: OrderDeliveryInfoEntity[];

  @OneToOne(() => OrderInvoiceEntity, (invoice) => invoice.order)
  @JoinColumn({
    name: 'order_invoice_id',
  })
  invoice: OrderInvoiceEntity;

  @Field(() => UserCouponEntity, {
    description: '订单使用优惠券',
  })
  @ManyToMany(() => UserCouponEntity, (coupon) => coupon.id)
  @JoinTable({
    name: 'order_coupons',
    joinColumn: {
      name: 'order_id',
    },
    inverseJoinColumn: {
      name: 'user_coupon_id',
    },
  })
  coupons: UserCouponEntity[];
}
