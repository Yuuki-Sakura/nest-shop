import { UserTempPermission } from '@/auth/auth.utils';
import { Timestamp } from '@adachi-sakura/nest-shop-common';
import { Gender, UserStatus } from '@adachi-sakura/nest-shop-entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsUrl } from 'class-validator';
import { Decimal } from 'decimal.js';

@ObjectType('UserLoginResult')
export class UserLoginResultDto {
  @Field()
  token: string;

  @Field(() => UserTempPermission)
  permission: UserTempPermission;

  @Field({
    description: '用户昵称',
  })
  nickname: string;

  @Field({
    description: '邮箱',
  })
  @IsEmail()
  email: string;

  @Field({
    description: '手机号',
  })
  @IsPhoneNumber()
  phone: string;

  @Exclude()
  password: string;

  @Exclude()
  payPassword: string;

  @Field({
    description: '头像',
  })
  @IsUrl()
  avatar: string;

  @Field(() => Gender, {
    description: '性别',
  })
  gender: Gender;

  @Field({ description: '生日', nullable: true })
  birthday: Date;

  @Field(() => UserStatus, {
    description: '用户状态',
  })
  status: UserStatus;

  @Field({ description: '上次登陆时间', nullable: true })
  @Timestamp()
  lastLoginAt?: Date;

  @Field({
    description: '上次登陆IP',
  })
  lastLoginIp: string;

  @Field({
    description: '用户余额',
  })
  balance: Decimal;

  @Field(() => Int, {
    description: '用户积分',
  })
  points: number;
}
