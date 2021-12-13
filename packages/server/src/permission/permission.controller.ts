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
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('权限')
@Controller('permission')
@Span()
export class PermissionController {
  @Inject()
  private readonly permissionService: PermissionService;

  @Get()
  @ApiQuery({
    type: createSwaggerPaginateQuery(PermissionPaginateConfig.find),
  })
  @ApiOkResponse({
    type: warpResponse({
      type: warpPaginated({ type: Permission }, PermissionPaginateConfig.find),
    }),
  })
  find(@Paginate() query: PaginateQuery) {
    return this.permissionService.find(query);
  }
}
