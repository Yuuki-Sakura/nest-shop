import UserAddressEntity from '@/address/entity/user-address.entity';
import { BaseEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { nanoid } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import UserDeviceEntity from '@/user/entity/user-device.entity';
import UserPermission from '@/user/entity/user-permission.entity';
import UserRole from '@/user/entity/user-role.entity';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

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
export class UserEntity extends BaseEntity {
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
  @Column('tinyint', {
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
  @Column('tinyint', {
    default: UserStatus.Active,
    comment: '用户状态',
  })
  status: UserStatus;

  @Field({ description: '上次登陆时间', nullable: true })
  @Timestamp({
    name: 'last_login_at',
    comment: '上次登陆时间',
    nullable: true,
  })
  lastLoginAt?: Date;

  @Field({
    description: '上次登陆IP',
  })
  @Timestamp({
    name: 'last_login_ip',
    comment: '上次登陆IP',
  })
  lastLoginIp: string;

  @Field(() => [UserDeviceEntity])
  @OneToMany(() => UserDeviceEntity, (device) => device.user, { cascade: true })
  devices: UserDeviceEntity[];

  @Field(() => [UserRole])
  @OneToMany(() => UserRole, (role) => role.user, { cascade: true })
  roles: UserRole[];

  @Field(() => [UserPermission])
  @OneToMany(() => UserPermission, (permission) => permission.user, {
    cascade: true,
  })
  permissions: UserPermission[];

  @Field(() => [UserAddressEntity])
  @OneToMany(() => UserAddressEntity, (address) => address.user, {
    cascade: true,
  })
  addresses: UserAddressEntity[];
}
