import { UserRole } from '@/user';
import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { GraphQLString } from 'graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('role')
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

  @OneToMany(() => UserRole, (userRole) => userRole.role, {
    cascade: ['soft-remove'],
  })
  @Exclude()
  user: UserRole[];
}
