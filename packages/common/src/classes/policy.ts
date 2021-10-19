import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

export enum PolicyType {
  None,
  Password,
  Question,
  Private = -1,
}

registerEnumType(PolicyType, {
  name: 'PolicyType',
});

@ObjectType()
class PolicyQuestion {
  @Field()
  content: string;
  @Field({ nullable: true })
  @Exclude()
  answer: string;
}

@ObjectType()
export class Policy {
  @Field(() => PolicyType)
  type: PolicyType;
  @Field({ nullable: true })
  @Exclude()
  password?: string;
  @Field(() => PolicyQuestion, { nullable: true })
  question?: PolicyQuestion;
}
