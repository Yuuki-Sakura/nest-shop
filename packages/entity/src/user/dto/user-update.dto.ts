import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty()
  readonly username?: string;
  @ApiProperty()
  readonly email?: string;
  @ApiProperty()
  readonly phone?: string;
  @ApiProperty()
  readonly avatar?: string;
}
