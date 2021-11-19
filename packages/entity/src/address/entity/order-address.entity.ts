import UserAddressEntity from '@/address/entity/user-address.entity';
import OrderEntity from '@/order/entity/order.entity';
import { ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('order_address')
@ObjectType('OrderAddress', {
  description: '订单地址',
})
export default class OrderAddressEntity extends UserAddressEntity {
  @OneToOne(() => OrderEntity, (order) => order.address)
  @JoinColumn({
    name: 'order_id',
  })
  order: OrderEntity;
}
