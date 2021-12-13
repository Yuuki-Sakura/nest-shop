import { Role } from '@adachi-sakura/nest-shop-entity';
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';

@InputType('RoleUpdateInput')
export class RoleUpdateDto
  implements Partial<Omit<Role, 'createAt' | 'deleteAt' | 'updateAt'>>
{
  @Field(() => ID)
  @ApiProperty({
    readOnly: true,
  })
  id: string;

  @Field({
    description: '是否隐藏',
  })
  @ApiProperty({
    description: '是否隐藏',
    readOnly: true,
  })
  isHidden?: boolean;

  @ApiProperty()
  @Field({
    description: '角色名称',
  })
  name?: string;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '角色包含权限',
  })
  permissions?: string[];

  @Field(() => Int, {
    description: '排序编号',
  })
  @ApiProperty({
    description: '排序编号',
    readOnly: true,
  })
  sort?: number;
}
