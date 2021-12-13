import { Span } from '@/common/decorator/span.decorator';
import { DistrictService } from '@/district/district.service';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('地区')
@Controller('district')
@Span()
export class DistrictController {
  @Inject()
  private readonly districtService: DistrictService;
  @Get(['', ':parentId'])
  @ApiParam({ name: 'id', type: String, required: false })
  find(@Param('parentId') id?: string) {
    return this.districtService.findChildren(id && +id);
  }

  @Get(['tree', 'tree/:parentId'])
  @ApiParam({ name: 'parentId', type: String, required: false })
  findDescendants(@Param('id') id?: string) {
    return this.districtService.findDescendants(id && +id);
  }

  @Get('tree/:childrenId/ancestors')
  findAncestors(@Param('childrenId') id: string) {
    return this.districtService.findAncestors(id && +id);
  }
}
