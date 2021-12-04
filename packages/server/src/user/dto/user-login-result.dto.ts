import { UserTempPermission } from '@/auth/auth.utils';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';

@ObjectType('UserLoginResult')
export class UserLoginResultDto {
  @Field()
  @ApiResponseProperty()
  token: string;

  @Field(() => UserEntity)
  @ApiResponseProperty({ type: UserEntity })
  @Type(() => UserEntity)
  user: UserEntity;

  @Field(() => [UserTempPermission])
  @ApiResponseProperty({ type: [UserTempPermission] })
  @Type(() => UserTempPermission)
  permissions: UserTempPermission[];
}
