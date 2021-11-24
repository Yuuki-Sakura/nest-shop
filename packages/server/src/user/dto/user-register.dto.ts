import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty()
  @IsEmail()
  readonly email?: string;

  @ApiProperty()
  @IsPhoneNumber()
  readonly phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
