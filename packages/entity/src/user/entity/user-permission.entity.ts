import { BaseEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Permission } from '@/permission';
import { UserEntity } from '@/user';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('user_permission')
@ObjectType({
  description: '用户权限关联信息',
})
export default class UserPermission extends BaseEntity {
  @ApiProperty({ type: () => UserEntity })
  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ type: () => [Permission] })
  @Field(() => [Permission])
  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permission_permissions',
  })
  permissions: Permission[];

  @ApiProperty()
  @Field()
  @Timestamp({
    name: 'expires_at',
    comment: '过期时间',
    nullable: true,
  })
  expiresAt?: Date;
}
