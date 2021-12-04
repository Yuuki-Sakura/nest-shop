import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

@ObjectType('UserLoginResult')
export class UserLoginResultDto {
  @Field()
  @ApiResponseProperty()
  token: string;

  @Field(() => UserEntity)
  @ApiResponseProperty({ type: UserEntity })
  user: UserEntity;
}
