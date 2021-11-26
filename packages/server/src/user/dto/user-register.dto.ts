import { IsStrongPassword } from '@/common/vaildator/IsStrongPassword';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly nickname?: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  readonly phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}
