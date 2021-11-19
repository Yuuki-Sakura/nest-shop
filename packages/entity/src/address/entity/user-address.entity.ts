import DistrictEntity from '@/district/entity/district.entity';
import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_address')
@ObjectType('UserAddress', {
  description: '用户地址',
})
export default class UserAddressEntity extends CommonEntity {
  @Field({
    description: '收件人名称',
  })
  @Column({
    comment: '收件人名称',
  })
  name: string;

  @Field({
    description: '收件人手机号',
  })
  @Column({
    comment: '收件人手机号',
  })
  mobile: string;

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

  @Field(() => UserEntity, {
    description: '地址关联用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.addresses)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;
}
