import { BaseEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@/user';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_device')
@ObjectType()
export default class UserDeviceEntity extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  userAgent: string;

  @Field()
  @Timestamp({
    name: 'last_login_at',
    comment: '上次登陆时间',
  })
  lastLoginAt: Date;

  @Field(() => [UserEntity])
  @ManyToOne(() => UserEntity, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
