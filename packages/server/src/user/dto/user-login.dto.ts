import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType('UserLoginInput')
export class UserLoginDto {
  @Field()
  @ApiProperty()
  @IsNotEmpty()
  phoneOrEmail: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
