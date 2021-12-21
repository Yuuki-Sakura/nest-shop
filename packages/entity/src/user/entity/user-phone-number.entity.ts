import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_phone_number')
@ObjectType('UserPhoneNumber')
export class UserPhoneNumberEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '手机号所属用户',
  })
  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field({
    description: '手机号',
  })
  @ApiProperty({
    description: '手机号',
  })
  @IsPhoneNumber()
  @Column({
    length: 50,
    comment: '手机号',
    unique: true,
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column('boolean', {
    name: 'is_primary',
    comment: '是否为主手机号',
    default: false,
  })
  isPrimary: boolean;

  @Column('boolean', {
    name: 'is_verified',
    comment: '手机号是否已验证',
    default: false,
  })
  isVerified: boolean;
}
