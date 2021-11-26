import { OrderEntity } from '@/order';
import { InvoiceType } from '@/user/entity/user-invoice.entity';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('order_invoice')
@ObjectType('OrderInvoice', {
  description: '订单发票信息',
})
export class OrderInvoiceEntity extends CommonEntity {
  @OneToOne(() => OrderEntity, (order) => order.invoice)
  @JoinColumn({
    name: 'order_id',
  })
  order: OrderEntity;

  @Field(() => InvoiceType)
  @Column('smallint', {
    comment: '发票类型',
  })
  type: InvoiceType;

  @Field({
    description: '发票抬头',
  })
  @Column({
    comment: '发票抬头',
  })
  name: string;

  @Field({
    description: '纳税人识别号',
    nullable: true,
  })
  @Column({
    comment: '纳税人识别号',
    nullable: true,
  })
  taxNo?: string;

  @Field({
    description: '注册地址',
    nullable: true,
  })
  @Column({
    comment: '注册地址',
    nullable: true,
  })
  address?: string;

  @Field({
    description: '注册电话',
    nullable: true,
  })
  @Column({
    comment: '注册电话',
    nullable: true,
  })
  telephone?: string;

  @Field({
    description: '开户银行',
    nullable: true,
  })
  @Column({
    comment: '开户银行',
    nullable: true,
  })
  openingBank?: string;

  @Field({
    description: '银行账号',
    nullable: true,
  })
  @Column({
    comment: '银行账号',
    nullable: true,
  })
  accountNumber?: string;
}
