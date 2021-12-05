import { GoodsSkuEntity, GoodsSpuEntity } from '@/goods';
import { OrderDeliveryInfoEntity, OrderEntity } from '@/order';
import { UserEntity } from '@/user';
import { CommonEntity, ToDecimal } from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('order_goods')
@ObjectType('OrderGoods', {
  description: '订单商品',
})
export class OrderGoodsEntity extends CommonEntity {
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
  @ToDecimal()
  buyPrice: Decimal;
}
