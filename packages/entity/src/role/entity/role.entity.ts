import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';
import {
  Column,
  Entity,
  JoinColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('role')
@Tree('materialized-path')
@ObjectType()
export class Role extends CommonEntity {
  @ApiProperty()
  @Field({
    description: '角色名称',
  })
  @Column({ comment: '角色名称', unique: true })
  name: string;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '角色包含权限',
  })
  @Column('json', {
    comment: '角色包含权限',
  })
  permissions: string[];

  @ApiProperty({
    type: () => [Role],
    description: '继承角色',
  })
  @Field(() => [Role], {
    description: '继承角色',
  })
  @TreeChildren()
  extends: Role[];

  @TreeParent()
  @JoinColumn({
    name: 'parent_id',
  })
  parent: Role;
}
