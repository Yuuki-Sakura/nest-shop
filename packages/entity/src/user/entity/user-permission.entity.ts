import { CommonEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@/user';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_permission')
@ObjectType({
  description: '用户权限关联信息',
})
export class UserPermission extends CommonEntity {
  @ApiProperty({ type: () => UserEntity })
  @Field(() => UserEntity, {
    description: '权限关联用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '用户单独授权权限',
  })
  @Column('json', {
    comment: '用户单独授权权限',
  })
  permissions: string[];

  @ApiProperty()
  @Field({
    description: '过期时间',
  })
  @Column('timestamp', {
    name: 'expires_at',
    comment: '过期时间',
    nullable: true,
  })
  @Timestamp()
  expiresAt?: Date;
}
