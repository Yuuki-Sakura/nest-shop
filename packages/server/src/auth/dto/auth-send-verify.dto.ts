import { ApiProperty } from '@nestjs/swagger';

export class AuthSendVerifyDto {
  @ApiProperty({ enum: ['email', 'phoneNumber'] })
  type: 'email' | 'phoneNumber';
  @ApiProperty({ required: false })
  phoneNumber?: string;
  @ApiProperty({ required: false })
  email?: string;
}
