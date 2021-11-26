import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

@InputType('UserLoginInput')
export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  readonly phone?: string;

  @Field()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @ApiProperty()
  @IsString()
  @IsOptional()
  fingerprint?: string;
}
