import { ApiProperty } from '@nestjs/swagger';

export class AuthEnableOtpStep2Dto {
  @ApiProperty()
  token: string;
  @ApiProperty()
  enableToken: string;
}
