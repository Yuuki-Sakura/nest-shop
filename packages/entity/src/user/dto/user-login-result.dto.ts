import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@/user/entity/user.entity';

@ObjectType('UserLoginResult')
export class UserLoginResultDto extends UserEntity {
  @Field()
  token: string;
}
