import { Span } from '@/common/decorator/span.decorator';
import { DistrictService } from '@/district/district.service';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('district')
@Controller('district')
@Span()
export class DistrictController {
  @Inject()
  private readonly districtService: DistrictService;

  @Get([':parentId'])
  @ApiOperation({
    summary: '获取地区列表',
    operationId: 'permission.find',
  })
  @ApiParam({ name: 'parentId', type: String, required: false })
  find(@Param('parentId') id?: string) {
    return this.districtService.findChildren(id && +id);
  }

  @Get(['tree/:parentId'])
  @ApiOperation({
    summary: '获取地区树',
    operationId: 'permission.findDescendants',
  })
  @ApiParam({ name: 'parentId', type: String, required: false })
  findDescendants(@Param('parentId') id?: string) {
    return this.districtService.findDescendants(id && +id);
  }

  @Get('tree/:childrenId/ancestors')
  @ApiOperation({
    summary: '获取父级地区树',
    operationId: 'permission.findAncestors',
  })
  findAncestors(@Param('childrenId') id: string) {
    return this.districtService.findAncestors(id && +id);
  }
}
