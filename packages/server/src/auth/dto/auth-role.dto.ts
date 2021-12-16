import { Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';

@InputType('AuthRoleInput')
export class AuthRoleDto {
  @ApiProperty({
    description: '用户id',
  })
  @Field({
    description: '用户id',
  })
  userId: string;

  @ApiProperty({
    description: '用户授权角色id',
  })
  @Field(() => [GraphQLString], {
    description: '用户授权角色id',
  })
  roleId: string;

  @ApiProperty({
    description: '过期时间',
  })
  @Field({
    description: '过期时间',
  })
  @Timestamp()
  expiresAt?: Date;
}
