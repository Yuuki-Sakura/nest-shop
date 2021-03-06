import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

@InputType('AuthLoginInput')
export class AuthLoginDto {
  @Field({
    nullable: true,
    description: '邮箱',
  })
  @ApiPropertyOptional({ type: String, description: '邮箱' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @Field({
    nullable: true,
    description: '手机号',
  })
  @ApiPropertyOptional({ type: String, description: '手机号' })
  @IsPhoneNumber()
  @IsOptional()
  readonly phoneNumber?: string;

  @Field({ description: '密码' })
  @ApiProperty({ type: String, description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({
    nullable: true,
    description: '登录设备指纹',
  })
  @ApiPropertyOptional({ type: String, description: '登录设备指纹' })
  @IsString()
  @IsOptional()
  fingerprint?: string;
}
