import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

//发票类型
export enum InvoiceType {
  Normal, //普通发票
  TaxInvoice, //增值税专用发票
}

registerEnumType(InvoiceType, {
  name: 'InvoiceType',
  description: '发票类型',
  valuesMap: {
    Normal: {
      description: '普通发票',
    },
    TaxInvoice: {
      description: '增值税专用发票',
    },
  },
});

@Entity('user_invoice')
@ObjectType('UserInvoice', {
  description: '用户发票信息',
})
export default class UserInvoiceEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '发票信息所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

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
