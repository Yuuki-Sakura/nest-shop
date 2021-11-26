import { OrderEntity, OrderGoodsEntity } from '@/order';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('order_goods_return_request')
@ObjectType('OrderGoodsReturnRequest', {
  description: '退货申请',
})
export class OrderGoodsReturnRequestEntity extends CommonEntity {
  @Field(() => OrderEntity, {
    description: '退货关联订单',
  })
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({
    name: 'order_id',
  })
  order: OrderEntity;

  @OneToOne(() => OrderGoodsEntity, (goods) => goods.id)
  @JoinColumn({
    name: 'order_goods_id',
  })
  goods: OrderGoodsEntity;

  @ApiProperty()
  @Field({
    description: '联系人姓名',
  })
  @Column({ comment: '联系人姓名', name: 'name' })
  name: string;

  @ApiProperty()
  @Field({
    description: '联系人电话',
  })
  @Column({ comment: '联系人电话' })
  phone: string;

  @Column({
    default: null,
    nullable: true,
  })
  rejectedReasons: string;
}
