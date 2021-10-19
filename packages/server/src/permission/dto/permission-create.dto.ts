import { HttpMethod } from '@adachi-sakura/nest-shop-entity';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  resource: string;

  @ApiProperty()
  route: string;

  @ApiProperty()
  method: HttpMethod;
}
