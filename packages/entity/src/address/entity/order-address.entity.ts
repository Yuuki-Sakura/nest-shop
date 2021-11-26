import { UserAddressEntity } from '@/address';
import { OrderEntity } from '@/order';
import { ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('order_address')
@ObjectType('OrderAddress', {
  description: '订单地址',
})
export class OrderAddressEntity extends UserAddressEntity {
  @OneToOne(() => OrderEntity, (order) => order.address)
  @JoinColumn({
    name: 'order_id',
  })
  order: OrderEntity;
}
