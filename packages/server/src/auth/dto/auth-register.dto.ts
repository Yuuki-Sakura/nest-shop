import { IsStrongPassword } from '@/common/vaildator/IsStrongPassword';
import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType('AuthRegisterInput')
export class AuthRegisterDto {
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
    description: '昵称',
  })
  @ApiPropertyOptional({ type: String, description: '昵称' })
  @IsString()
  @IsOptional()
  readonly nickname?: string;

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
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;

  @Field({
    nullable: true,
    description: '是否注册并登录',
  })
  @ApiPropertyOptional({
    required: false,
    description: '是否注册并登录',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly andLogin?: boolean = false;

  @Field({
    nullable: true,
    description: '设备指纹',
  })
  @ApiPropertyOptional({ type: String, description: '登录设备指纹' })
  @IsString()
  @IsOptional()
  fingerprint?: string;
}
