import { ApiProperty } from '@nestjs/swagger';

export class PaginationOptions {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  limit: number;
}
