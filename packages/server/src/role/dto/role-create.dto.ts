import { RoleUpdateDto } from '@/role/dto/role-update.dto';
import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GraphQLString } from 'graphql';

@InputType('RoleCreateInput')
export class RoleCreateDto implements Omit<RoleUpdateDto, 'id'> {
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
  name: string;

  @ApiProperty()
  @Field(() => [GraphQLString], {
    description: '角色包含权限',
  })
  permissions: string[];

  @Field(() => Int, {
    description: '排序编号',
  })
  @ApiProperty({
    description: '排序编号',
    readOnly: true,
  })
  sort?: number;
}
