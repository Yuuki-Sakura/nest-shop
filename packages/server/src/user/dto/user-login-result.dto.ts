import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('UserLoginResult')
export class UserLoginResultDto extends UserEntity {
  @Field()
  token: string;
}
