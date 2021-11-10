import OrderAddressEntity from '@/address/entity/order-address.entity';
import OrderGroupEntity from '@/order/entity/order-group.entity';
import { UserEntity } from '@/user';
import {
  BaseEntity,
  generateSn,
  OrderPrefixEnum,
} from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

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

  sn: string = generateSn(OrderPrefixEnum.Order);
}
