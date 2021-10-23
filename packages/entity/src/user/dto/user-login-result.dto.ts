import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@/user';

@ObjectType('UserLoginResult')
export class UserLoginResultDto extends UserEntity {
  @Field()
  token: string;
}
