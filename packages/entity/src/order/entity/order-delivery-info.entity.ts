import CarrierEntity from '@/carrier/entity/carrier.entity';
import OrderGoodsEntity from '@/order/entity/order-goods.entity';
import OrderEntity from '@/order/entity/order.entity';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

//发货方式
export enum DeliveryMethod {
  Express, //快递服务
  Virtual, //虚拟发货
}

registerEnumType(DeliveryMethod, {
  name: 'DeliveryMethod',
  description: '发货方式',
  valuesMap: {
    Express: {
      description: '快递服务',
    },
    Virtual: {
      description: '虚拟发货',
    },
  },
});

@Entity('order_delivery_info')
@ObjectType('OrderDeliveryInfo', {
  description: '订单发货信息',
})
export default class OrderDeliveryInfoEntity extends CommonEntity {
  @Field(() => OrderEntity, {
    description: '发货信息所属订单',
  })
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({
    name: 'order_id',
  })
  order: OrderEntity;

  @Field(() => OrderGoodsEntity, {
    description: '发货商品',
  })
  @OneToMany(() => OrderGoodsEntity, (orderGoods) => orderGoods.id)
  goods: OrderGoodsEntity[];

  @Field(() => DeliveryMethod, {
    description: '发货方式',
  })
  @Column('smallint', {
    comment: '发货方式',
    name: 'delivery_method',
  })
  deliveryMethod: DeliveryMethod;

  @Field(() => CarrierEntity, {
    description: '承运人',
  })
  @ManyToOne(() => CarrierEntity, (carrier) => carrier.id)
  @JoinColumn({
    name: 'carrier_id',
  })
  carrier: CarrierEntity;

  @Field({
    description: '快递追踪号码',
  })
  @Column({
    comment: '快递追踪号码',
    name: 'tracking_number',
  })
  trackingNumber: string;
}
