import { Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';

@InputType('AuthPermissionInput')
export class AuthPermissionDto {
  @ApiProperty({
    description: '用户id',
  })
  @Field({
    description: '用户id',
  })
  userId: string;

  @ApiProperty({
    description: '用户单独授权权限',
  })
  @Field(() => [GraphQLString], {
    description: '用户单独授权权限',
  })
  permissions: string[];

  @ApiProperty({
    description: '过期时间',
  })
  @Field({
    description: '过期时间',
  })
  @Timestamp()
  expiresAt?: Date;
}
