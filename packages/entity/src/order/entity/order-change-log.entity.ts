import OrderEntity from '@/order/entity/order.entity';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('order_change_log')
@ObjectType('OrderChangeLog', {
  description: '订单操作记录',
})
export default class OrderChangeLogEntity extends CommonEntity {
  @Field(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.id)
  @JoinColumn({
    name: 'order_id',
  })
  @Index()
  order: OrderEntity;

  @Field({
    description: '订单操作',
  })
  @Column('tinyint', {
    comment: '订单操作',
  })
  action: string;

  @Field({
    description: '操作信息',
  })
  @Column('tinyint', {
    comment: '操作信息',
  })
  message: string;
}
