import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: '邮箱格式错误' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
