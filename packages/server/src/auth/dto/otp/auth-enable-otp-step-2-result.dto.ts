import { ApiProperty } from '@nestjs/swagger';

export class AuthEnableOtpStep2ResultDto {
  @ApiProperty()
  backupCodes: string[];
}
