import { OrderEntity, OrderGoodsEntity } from '@/order';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

export enum OrderGoodsRefundRequestStatus {
  Rejected = -1, //退款已驳回
  InProgress, //退款处理中
  Passed, //申请已通过
  Refunded, //已退款
}

registerEnumType(OrderGoodsRefundRequestStatus, {
  name: 'OrderRefundStatus',
  description: '退款申请状态',
  valuesMap: {
    Rejected: {
      description: '退款已驳回',
    },
    InProgress: {
      description: '退款处理中',
    },
    Refunded: {
      description: '已退款',
    },
  },
});

@Entity('order_goods_refund_request')
@ObjectType('OrderGoodsRefundRequest', {
  description: '退款申请',
})
export class OrderGoodsRefundRequestEntity extends CommonEntity {
  @Field(() => OrderEntity, {
    description: '退款关联订单',
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

  @Field(() => OrderGoodsRefundRequestStatus)
  @Column('smallint', {
    comment: '退款申请状态',
  })
  status: OrderGoodsRefundRequestStatus;

  @Field({
    description: '退款原因',
  })
  @Column({
    comment: '退款原因',
  })
  reasons: string;

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
