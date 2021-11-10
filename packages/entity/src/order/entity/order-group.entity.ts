import OrderEntity from '@/order/entity/order.entity';
import { UserEntity } from '@/user';
import {
  BaseEntity,
  generateSn,
  OrderPrefixEnum,
} from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
@Entity('order_group')
@ObjectType('OrderGroup', {
  description: '订单组(用于支付)',
})
export default class OrderGroupEntity extends BaseEntity {
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.id)
  order: OrderEntity[];

  sn: string = generateSn(OrderPrefixEnum.GroupOrder);
}
