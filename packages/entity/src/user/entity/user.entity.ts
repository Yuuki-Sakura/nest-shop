import { UserAddressEntity } from '@/address';
import { UserCouponEntity } from '@/coupon/entity/user-coupon.entity';
import { GoodsSkuEntity } from '@/goods';
import {
  UserDeviceEntity,
  UserPermission,
  UserRole,
  UserInvoiceEntity,
} from '@/user';
import { UserEmailEntity } from '@/user/entity/user-email.entity';
import { UserPhoneNumberEntity } from '@/user/entity/user-phone-number.entity';
import {
  CommonEntity,
  Timestamp,
  DecimalTransformer,
} from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsUrl } from 'class-validator';
import { Decimal } from 'decimal.js';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum Gender {
  Secrecy, //保密
  Male, //男性
  Female, //女性
  Other, //其他
}

export enum UserStatus {
  Active,
  Banned,
}

registerEnumType(Gender, {
  name: 'Gender',
  description: '性别',
  valuesMap: {
    Secrecy: {
      description: '保密',
    },
    Male: {
      description: '男性',
    },
    Female: {
      description: '女性',
    },
    Other: {
      description: '其他',
    },
  },
});
registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: '用户状态',
  valuesMap: {
    Active: {
      description: '正常',
    },
    Banned: {
      description: '已禁用',
    },
  },
});

@Entity('user')
@ObjectType('User', {
  description: '用户信息',
})
export class UserEntity extends CommonEntity {
  @Field({
    description: '用户昵称',
  })
  @ApiProperty({
    description: '用户昵称',
  })
  @Column({
    length: 500,
    comment: '用户昵称',
  })
  nickname: string;

  @Field(() => [UserEmailEntity], {
    description: '用户邮箱',
  })
  @ApiProperty({
    description: '用户邮箱',
    type: UserEmailEntity,
    isArray: true,
  })
  @OneToMany(() => UserEmailEntity, (email) => email.user)
  email: UserEmailEntity[];

  @Field({
    description: '用户主邮箱',
  })
  @ApiProperty({
    description: '用户主邮箱',
  })
  @IsEmail()
  @OneToOne(() => UserEmailEntity, (email) => email.id)
  @JoinColumn({
    name: 'primary_user_email_id',
    referencedColumnName: 'user_id',
  })
  primaryEmail: UserEmailEntity;

  @Field(() => [UserPhoneNumberEntity], {
    description: '用户手机号码',
  })
  @ApiProperty({
    description: '用户手机号码',
    type: UserPhoneNumberEntity,
    isArray: true,
  })
  @OneToMany(() => UserPhoneNumberEntity, (phone) => phone.user)
  phoneNumbers: UserPhoneNumberEntity[];

  @Field({
    description: '用户主手机号码',
  })
  @ApiProperty({
    description: '用户主手机号码',
  })
  @IsEmail()
  @OneToOne(() => UserPhoneNumberEntity, (phone) => phone.id)
  @JoinColumn({
    name: 'primary_user_phone_number_id',
    referencedColumnName: 'user_id',
  })
  primaryPhoneNumber: UserPhoneNumberEntity;

  @Column({
    length: 256,
    comment: '密码',
  })
  @Exclude()
  password: string;

  @Column({
    length: 256,
    comment: '支付密码',
    name: 'pay_password',
    nullable: true,
  })
  @ApiProperty({
    description: '支付密码',
  })
  @Exclude()
  payPassword: string;

  @Field({
    description: '头像',
  })
  @ApiProperty({
    description: '头像',
  })
  @IsUrl()
  @Column({
    length: 500,
    default: '',
    comment: '头像',
  })
  avatar: string;

  @Field(() => Gender, {
    description: '性别',
  })
  @ApiProperty({
    description: '性别',
  })
  @Column('smallint', {
    default: Gender.Secrecy,
    comment: '性别',
  })
  gender: Gender;

  @Field({
    description: '生日',
    nullable: true,
  })
  @ApiProperty({
    description: '生日',
    nullable: true,
  })
  @Column('timestamp', {
    comment: '生日',
    default: null,
  })
  birthday: Date;

  @Field(() => UserStatus, {
    description: '用户状态',
  })
  @ApiProperty({
    description: '用户状态',
  })
  @Column('smallint', {
    default: UserStatus.Active,
    comment: '用户状态',
  })
  status: UserStatus;

  @Field({
    description: '上次登陆时间',
    nullable: true,
  })
  @ApiProperty({
    description: '上次登陆时间',
    nullable: true,
  })
  @Column('timestamp', {
    name: 'last_login_at',
    comment: '上次登陆时间',
    nullable: true,
  })
  @Timestamp()
  lastLoginAt?: Date;

  @Field({
    description: '上次登陆IP',
    nullable: true,
  })
  @ApiProperty({
    description: '上次登陆IP',
    nullable: true,
  })
  @Column({
    name: 'last_login_ip',
    comment: '上次登陆IP',
    nullable: true,
  })
  lastLoginIp: string;

  @Field({
    description: '用户余额',
  })
  @ApiProperty({
    description: '用户余额',
    type: String,
    example: '0.00',
  })
  @Column('decimal', {
    comment: '用户余额',
    unsigned: true,
    precision: 11,
    scale: 2,
    default: '0.00',
    transformer: DecimalTransformer(),
  })
  balance: Decimal;

  @Field(() => Int, {
    description: '用户积分',
  })
  @ApiProperty({
    description: '用户积分',
  })
  @Column('int', {
    comment: '用户积分',
    default: 0,
    unsigned: true,
  })
  points: number;

  @Field(() => [UserDeviceEntity], {
    description: '用户设备',
  })
  @ApiProperty({
    description: '用户设备',
    type: UserDeviceEntity,
    isArray: true,
  })
  @OneToMany(() => UserDeviceEntity, (device) => device.user, { cascade: true })
  devices: UserDeviceEntity[];

  @Field(() => [UserRole], {
    description: '用户拥有角色',
  })
  @ApiProperty({
    description: '用户拥有角色',
    type: UserRole,
    isArray: true,
  })
  @OneToMany(() => UserRole, (role) => role.user, { cascade: true })
  roles: UserRole[];

  @Field(() => [UserPermission], {
    description: '用户拥有权限',
  })
  @ApiProperty({
    description: '用户拥有权限',
    type: UserPermission,
    isArray: true,
  })
  @OneToMany(() => UserPermission, (permission) => permission.user, {
    cascade: true,
  })
  permissions: UserPermission[];

  @Field(() => [UserAddressEntity], {
    description: '用户收货地址',
  })
  @ApiProperty({
    description: '用户收货地址',
    type: UserAddressEntity,
    isArray: true,
  })
  @OneToMany(() => UserAddressEntity, (address) => address.user, {
    cascade: true,
  })
  addresses: UserAddressEntity[];

  @Field(() => [GoodsSkuEntity], {
    description: '用户收藏商品',
  })
  @ApiProperty({
    description: '用户收藏商品',
    type: GoodsSkuEntity,
    isArray: true,
  })
  @ManyToMany(() => GoodsSkuEntity, (sku) => sku.id)
  @JoinTable({
    name: 'user_favorites_sku',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'sku_id',
    },
  })
  favorites: GoodsSkuEntity[];

  @Field(() => [UserCouponEntity], {
    description: '用户优惠券',
  })
  @ApiProperty({
    description: '用户优惠券',
    type: UserCouponEntity,
    isArray: true,
  })
  @ManyToMany(() => UserCouponEntity, (coupon) => coupon.id)
  @JoinTable({
    name: 'user_coupons',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'coupon_id',
    },
  })
  coupons: UserCouponEntity[];

  @Field(() => [UserInvoiceEntity], {
    description: '用户发票信息',
  })
  @ApiProperty({
    description: '用户发票信息',
    type: UserInvoiceEntity,
    isArray: true,
  })
  @OneToMany(() => UserInvoiceEntity, (invoice) => invoice.user)
  invoice: UserInvoiceEntity[];

  // @ManyToMany(() => GoodsSkuEntity, (sku) => sku.id)
  // @JoinTable({
  //   name: 'user_visited_sku',
  //   joinColumn: {
  //     name: 'user_id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'sku_id',
  //   },
  // })
  // visited: GoodsSkuEntity[];
}
