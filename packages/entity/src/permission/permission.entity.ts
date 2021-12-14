import { CommonEntity } from '@adachi-sakura/nest-shop-common';
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
export class Permission extends CommonEntity {
  @Field({
    description: '权限名称',
  })
  @ApiProperty({
    description: '权限名称',
  })
  @Column({ comment: '权限名称', default: '' })
  name: string;

  @Field({
    description: '资源',
  })
  @ApiProperty({
    description: '资源',
  })
  @Column({ comment: '资源', unique: true })
  resource: string;

  @Field({ description: '路由', nullable: true })
  @ApiProperty({ description: '路由', nullable: true })
  @Column({ comment: '路由', nullable: true })
  route: string;

  @ApiProperty({ description: 'Http方法', nullable: true, enum: HttpMethod })
  @Field(() => HttpMethod, { description: 'Http方法', nullable: true })
  @Column('simple-enum', { comment: '方法', nullable: true, enum: HttpMethod })
  method: HttpMethod;
}
