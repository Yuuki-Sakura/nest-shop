import OrderEntity from '@/order/entity/order.entity';
import { UserEntity } from '@/user';
import {
  BaseEntity,
  generateSn,
  OrderPrefixEnum,
} from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
@Entity('order_group')
@ObjectType('OrderGroup', {
  description: '订单组(用于支付)',
})
export default class OrderGroupEntity extends BaseEntity {
  @Field(() => UserEntity, {
    description: '订单组所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field(() => [OrderEntity], {
    description: '子订单',
  })
  @OneToMany(() => OrderEntity, (order) => order.id)
  order: OrderEntity[];

  @Field({
    description: '订单编号',
  })
  @Column('varchar', {
    length: 20,
    comment: '订单编号',
  })
  sn: string = generateSn(OrderPrefixEnum.GroupOrder);
}
