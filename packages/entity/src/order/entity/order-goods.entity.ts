import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import GoodsSpuEntity from '@/goods/entity/goods-spu.entity';
import OrderDeliveryInfoEntity from '@/order/entity/order-delivery-info.entity';
import OrderEntity from '@/order/entity/order.entity';
import { UserEntity } from '@/user';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common/dist/transformer/decimal.transformer';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum OrderRefundStatus {
  NoRefund, //未发起退款
  InProgress, //退款处理中
  PartialRefund, //部分退款
  FullRefund, //全部退款
}

registerEnumType(OrderRefundStatus, {
  name: 'OrderRefundStatus',
  description: '退款状态',
  valuesMap: {
    NoRefund: {
      description: '未发起退款',
    },
    InProgress: {
      description: '退款处理中',
    },
    PartialRefund: {
      description: '部分退款',
    },
    FullRefund: {
      description: '全部退款',
    },
  },
});

@Entity('order_goods')
@ObjectType('sOrderGoods', {
  description: '订单商品',
})
export default class OrderGoodsEntity extends BaseEntity {
  @Field(() => UserEntity, {
    description: '所属订单',
  })
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({
    name: 'order_id',
  })
  order: OrderEntity;

  @Field(() => UserEntity, {
    description: '订单用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => GoodsSpuEntity)
  @ManyToOne(() => GoodsSpuEntity, (spu) => spu.id)
  @JoinColumn({
    name: 'spu_id',
  })
  spu: GoodsSpuEntity;

  @Field(() => GoodsSkuEntity)
  @ManyToOne(() => GoodsSkuEntity, (spu) => spu.id)
  @JoinColumn({
    name: 'sku_id',
  })
  sku: GoodsSkuEntity;

  @Field(() => OrderDeliveryInfoEntity, {
    description: '商品发货信息',
  })
  @OneToOne(() => OrderDeliveryInfoEntity, (deliveryInfo) => deliveryInfo.id, {
    nullable: true,
  })
  @JoinColumn({
    name: 'delivery_info_id',
  })
  deliveryInfo: OrderDeliveryInfoEntity;

  @Field(() => Int, {
    description: '购买数量',
  })
  @Column('int', {
    comment: '购买数量',
    unsigned: true,
  })
  quantity: number;

  @Field()
  @Column('decimal', {
    comment: '购买时价格',
    unsigned: true,
    precision: 11,
    scale: 2,
    name: 'buy_price',
    transformer: DecimalTransformer(),
  })
  buyPrice: Decimal;

  @Column('tinyint', {
    comment: '退款状态',
    name: 'refund_status',
  })
  refundStatus: OrderRefundStatus;
}
