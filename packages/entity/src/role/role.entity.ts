import { BaseEntity } from '@adachi-sakura/nest-shop-common';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@/permission/permission.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('role')
@ObjectType()
export class Role extends BaseEntity {
  @Field()
  @ApiProperty()
  @Column({ comment: '角色名称', unique: true })
  name: string;

  @Field(() => [Permission])
  @ApiProperty()
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @Field(() => [Role])
  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  extends: Role[];
}
