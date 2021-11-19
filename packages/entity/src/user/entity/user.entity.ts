import UserAddressEntity from '@/address/entity/user-address.entity';
import UserCouponEntity from '@/coupon/entity/user-coupon.entity';
import GoodsSkuEntity from '@/goods/entity/goods-sku.entity';
import UserInvoiceEntity from '@/user/entity/user-invoice.entity';
import {
  CommonEntity,
  Timestamp,
  DecimalTransformer,
  nanoid,
} from '@adachi-sakura/nest-shop-common';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import UserDeviceEntity from '@/user/entity/user-device.entity';
import UserPermission from '@/user/entity/user-permission.entity';
import UserRole from '@/user/entity/user-role.entity';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Decimal } from 'decimal.js';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

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
    description: '用户名',
  })
  @Column({
    length: 500,
    comment: '用户名',
    unique: true,
  })
  username: string = nanoid(10);

  @Field({
    description: '用户昵称',
  })
  @Column({ length: 500, comment: '用户昵称' })
  nickname: string;

  @Field({
    description: '邮箱',
  })
  @IsEmail()
  @Column({ length: 50, nullable: true, comment: '邮箱' })
  email: string;

  @Field({
    description: '手机号',
  })
  @Column({ comment: '手机号', unique: true })
  phone: string;

  @Column({ length: 256, comment: '密码' })
  @Exclude()
  password: string;

  @Column({
    length: 256,
    comment: '支付密码',
    name: 'pay_password',
    nullable: true,
  })
  @Exclude()
  payPassword: string;

  @Field({
    description: '头像',
  })
  @Column({ length: 500, default: '', comment: '头像' })
  avatar: string;

  @Field(() => Gender, {
    description: '性别',
  })
  @Column('smallint', {
    default: Gender.Secrecy,
    comment: '性别',
  })
  gender: Gender;

  @Field({ description: '生日', nullable: true })
  @Column('timestamp', { comment: '生日', default: null })
  birthday: Date;

  @Field(() => UserStatus, {
    description: '用户状态',
  })
  @Column('smallint', {
    default: UserStatus.Active,
    comment: '用户状态',
  })
  status: UserStatus;

  @Field({ description: '上次登陆时间', nullable: true })
  @Column('timestamp', {
    name: 'last_login_at',
    comment: '上次登陆时间',
    nullable: true,
  })
  @Timestamp()
  lastLoginAt?: Date;

  @Field({
    description: '上次登陆IP',
  })
  @Column({
    name: 'last_login_ip',
    comment: '上次登陆IP',
  })
  lastLoginIp: string;

  @Field({
    description: '用户余额',
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
  @Column('int', {
    comment: '用户积分',
    default: 0,
    unsigned: true,
  })
  points: number;

  @Field(() => [UserDeviceEntity], {
    description: '用户设备',
  })
  @OneToMany(() => UserDeviceEntity, (device) => device.user, { cascade: true })
  devices: UserDeviceEntity[];

  @Field(() => [UserRole], {
    description: '用户拥有角色',
  })
  @OneToMany(() => UserRole, (role) => role.user, { cascade: true })
  roles: UserRole[];

  @Field(() => [UserPermission], {
    description: '用户拥有权限',
  })
  @OneToMany(() => UserPermission, (permission) => permission.user, {
    cascade: true,
  })
  permissions: UserPermission[];

  @Field(() => [UserAddressEntity], {
    description: '用户收货地址',
  })
  @OneToMany(() => UserAddressEntity, (address) => address.user, {
    cascade: true,
  })
  addresses: UserAddressEntity[];

  @Field(() => [GoodsSkuEntity], {
    description: '用户收藏商品',
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

  @Field(() => UserInvoiceEntity, {
    description: '用户发票信息',
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
