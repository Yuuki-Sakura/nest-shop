import { Span } from '@/common/decorator/span.decorator';
import {
  createSwaggerPaginateQuery,
  warpPaginated,
} from '@/common/utils/warp-paginated';
import { warpResponse } from '@/common/utils/warp-response';
import { PermissionPaginateConfig } from '@/permission/paginate-config';
import { Paginate, PaginateQuery } from '@adachi-sakura/nest-shop-common';
import { Permission } from '@adachi-sakura/nest-shop-entity';
import { Controller, Get, Inject } from '@nestjs/common';
import { PermissionService } from '@/permission/permission.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('permission')
@Controller('permission')
@Span()
export class PermissionController {
  @Inject()
  private readonly permissionService: PermissionService;

  @Get()
  @ApiOperation({
    summary: '获取权限列表',
    operationId: 'permission.find',
  })
  @ApiOkResponse({ type: [Permission] })
  find() {
    return this.permissionService.find();
  }

  @Get('paginate')
  @ApiOperation({
    summary: '获取权限列表(分页)',
    operationId: 'permission.findPaginate',
  })
  @ApiQuery({
    type: createSwaggerPaginateQuery(PermissionPaginateConfig.find),
  })
  @ApiOkResponse({
    type: warpResponse({
      type: warpPaginated({ type: Permission }, PermissionPaginateConfig.find),
    }),
  })
  findPaginate(@Paginate() query: PaginateQuery) {
    return this.permissionService.findPaginate(query);
  }
}
