import { CommonEntity } from '@adachi-sakura/nest-shop-common';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from '@/permission';
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

  @ApiProperty({ type: () => [Permission] })
  @Field(() => [Permission], {
    description: '角色包含权限',
  })
  @ManyToMany(() => Permission)
  @JoinTable({
    joinColumn: {
      name: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  permissions: Permission[];

  @ApiProperty({ type: () => [Role] })
  @Field(() => [Role], {
    description: '继承角色',
  })
  @ManyToMany(() => Role)
  @JoinTable({
    joinColumn: {
      name: 'parent_role_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  extends: Role[];
}
