import { ApiProperty } from '@nestjs/swagger';

export class RoleUpdateDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  permissionIds?: string[];
}
