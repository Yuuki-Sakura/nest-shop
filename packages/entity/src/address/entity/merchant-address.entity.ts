import DistrictEntity from '@/district/entity/district.entity';
import MerchantEntity from '@/merchant/entity/merchant.entity';
import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('merchant_address')
@ObjectType('MerchantAddress', {
  description: '商户关联地址',
})
export default class MerchantAddressEntity extends BaseEntity {
  @Field(() => DistrictEntity, {
    description: '地址关联国家/地区信息',
  })
  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'country_id',
  })
  country: DistrictEntity;

  @Field(() => DistrictEntity, {
    description: '地址关联省份信息',
  })
  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'province_id',
  })
  province: DistrictEntity;

  @Field(() => DistrictEntity, {
    description: '地址关联城市信息',
  })
  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'city_id',
  })
  city: DistrictEntity;

  @Field(() => DistrictEntity, {
    description: '地址关联区/县信息',
  })
  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({
    name: 'district_id',
  })
  district: DistrictEntity;

  @Field({
    description: '详细地址',
  })
  @Column({
    comment: '详细地址',
  })
  address: string;

  @Field(() => GraphQLString, {
    description: '经纬度',
  })
  get location() {
    return this.longitude + ',' + this.latitude;
  }

  @Field({
    description: '经度',
  })
  @Column('point', {
    comment: '经度',
  })
  longitude: string;

  @Field({
    description: '纬度',
  })
  @Column('point', {
    comment: '纬度',
  })
  latitude: string;

  @Field(() => MerchantEntity, {
    description: '地址关联商户',
  })
  @OneToOne(() => MerchantEntity)
  merchant: MerchantEntity;
}
