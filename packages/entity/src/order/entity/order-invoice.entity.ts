import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity('order_invoice')
@ObjectType('OrderInvoice', {
  description: '订单发票信息',
})
export default class OrderInvoiceEntity extends CommonEntity {}
