import { ApiProperty } from '@nestjs/swagger';

export class AuthEnableOtpStep1ResultDto {
  @ApiProperty()
  secret: string;
  @ApiProperty()
  uri: string;
  @ApiProperty()
  qrcode: string;
  @ApiProperty()
  enableToken: string;
}
