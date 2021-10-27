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
});
registerEnumType(UserStatus, {
  name: 'UserStatus',
});

@Entity('user')
@ObjectType('User', {
  description: '用户信息',
})
export class UserEntity extends BaseEntity {
  @Field()
  @Column({
    length: 500,
    comment: '用户名',
    unique: true,
    default: () => nanoid(10),
  })
  username: string;

  @Field()
  @Column({ length: 500, comment: '用户昵称' })
  nickname: string;

  @Field()
  @IsEmail()
  @Column({ length: 50, comment: '邮箱', unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ comment: '手机号', nullable: true, unique: true })
  phone: string;

  @Column({ length: 256, comment: '密码' })
  @Exclude()
  password: string;

  @Column({ length: 256, comment: '支付密码', name: 'pay_password' })
  @Exclude()
  payPassword: string;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true, default: null, comment: '头像' })
  avatar: string;

  @Field(() => Gender)
  @Column('simple-enum', {
    enum: Gender,
    default: Gender.Secrecy,
    comment: '性别',
  })
  gender: Gender;

  @Field({ nullable: true })
  @Column('timestamp', { comment: '生日', default: null })
  birthday: Date;

  @Field(() => UserStatus)
  @Column('simple-enum', {
    enum: UserStatus,
    default: UserStatus.Active,
    comment: '用户状态',
  })
  status: UserStatus;

  @Field({ nullable: true })
  @Timestamp({
    name: 'last_login_at',
    comment: '上次登陆时间',
    nullable: true,
  })
  lastLoginAt?: Date;

  @Field()
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
}
