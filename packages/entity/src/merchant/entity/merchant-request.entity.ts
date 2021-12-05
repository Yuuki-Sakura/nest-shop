import { MerchantAddressEntity } from '@/address';
import { MerchantQualification, MerchantType } from '@/merchant';
import { UserEntity } from '@/user';
import { CommonEntity, ToDecimal } from '@adachi-sakura/nest-shop-common';
import { DecimalTransformer } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('merchant_request')
@ObjectType('MerchantRequest', {
  description: '商户申请信息',
})
export default class MerchantRequestEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @ApiProperty()
  @Field({
    description: '商户名称',
  })
  @Column({
    comment: '商户名称',
  })
  name: string;

  @Field(() => MerchantAddressEntity, {
    description: '商户地址',
  })
  @OneToOne(() => MerchantAddressEntity, (address) => address.merchant)
  @JoinColumn({
    name: 'address_id',
  })
  address: MerchantAddressEntity;

  @ApiProperty()
  @Field(() => MerchantType, {
    description: '商户类型',
  })
  @Column('smallint', {
    comment: '商户类型',
  })
  type: MerchantType;

  @ApiProperty()
  @Field(() => [MerchantQualification], {
    description: '商户资质图片',
  })
  @Column('json', {
    comment: '商户资质',
    name: 'qualifications',
  })
  qualifications: MerchantQualification[];

  @ApiProperty()
  @Field({
    description: '联系人姓名',
  })
  @Column({ comment: '联系人姓名', name: 'real_name' })
  realName: string;

  @ApiProperty()
  @Field({
    description: '联系人电话',
  })
  @Column({ comment: '联系人电话', unique: true })
  phone: string;

  @ApiProperty()
  @Field({
    description: '商户简介',
  })
  @Column({
    comment: '商户简介',
    default: '',
  })
  summary: string;

  @ApiProperty()
  @Field({
    description: '商户头像',
  })
  @Column({ length: 500, default: '', comment: '头像' })
  avatar: string;

  @ApiProperty()
  @Field({
    description: '商户保证金',
  })
  @Column('decimal', {
    comment: '商户保证金',
    unsigned: true,
    precision: 11,
    scale: 2,
    transformer: DecimalTransformer(),
  })
  @ToDecimal()
  guarantee: Decimal;
}
