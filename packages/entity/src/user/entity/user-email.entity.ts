import { UserEntity } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_email')
@ObjectType('UserEmail')
export class UserEmailEntity extends CommonEntity {
  @Field(() => UserEntity, {
    description: '邮箱所属用户',
  })
  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Field({
    description: '邮箱',
  })
  @ApiProperty({
    description: '邮箱',
  })
  @IsEmail()
  @Column({
    length: 50,
    comment: '邮箱',
    unique: true,
  })
  email: string;

  @Column('boolean', {
    name: 'is_primary',
    comment: '是否为主邮箱',
    default: false,
  })
  isPrimary: boolean;

  @Column('boolean', {
    name: 'is_verified',
    comment: '邮箱是否已验证',
    default: false,
  })
  isVerified: boolean;
}
