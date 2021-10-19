import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

registerEnumType(HttpMethod, {
  name: 'HttpMethod',
});

@Entity('permission')
@ObjectType()
export class Permission extends BaseEntity {
  @Field()
  @ApiProperty()
  @Column({ comment: '权限名称', default: '' })
  name: string;

  @Field()
  @ApiProperty()
  @Column({ comment: '资源', unique: true })
  resource: string;

  @Field({ nullable: true })
  @Column({ comment: '路由', nullable: true })
  route: string;

  @Field(() => HttpMethod, { nullable: true })
  @Column({ comment: '方法', nullable: true, enum: HttpMethod })
  method: HttpMethod;
}
