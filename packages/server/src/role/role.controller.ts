import { Span } from '@/common/decorator/span.decorator';
import {
  createSwaggerPaginateQuery,
  warpPaginated,
} from '@/common/utils/warp-paginated';
import { warpResponse } from '@/common/utils/warp-response';
import { RoleUpdateDto } from '@/role/dto/role-update.dto';
import { RolePaginateConfig } from '@/role/paginate-config';
import { Paginate, PaginateQuery } from '@adachi-sakura/nest-shop-common';
import { Role } from '@adachi-sakura/nest-shop-entity';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleCreateDto } from '@/role/dto/role-create.dto';
import { Auth } from '@/auth/auth.utils';

@ApiTags('角色')
@Controller('role')
@Span()
export class RoleController {
  @Inject()
  private readonly roleService: RoleService;

  @Get()
  @Auth('role.find', '查找角色')
  @ApiQuery({
    type: createSwaggerPaginateQuery(RolePaginateConfig.find),
  })
  @ApiOkResponse({
    type: warpResponse({
      type: warpPaginated({ type: Role }, RolePaginateConfig.find),
    }),
  })
  find(@Paginate() query: PaginateQuery) {
    return this.roleService.find(query);
  }

  @Get(':id')
  @Auth('role.detail', '获取角色详情')
  @ApiOkResponse({ type: warpResponse({ type: Role }) })
  async getDetail(@Param('id') id: string) {
    return await this.roleService.findById(id);
  }

  @Post()
  @Auth('role.create', '创建角色')
  @ApiBody({ type: RoleCreateDto })
  create(@Body() role: RoleCreateDto) {
    return this.roleService.create(role);
  }

  @Post()
  @Auth('role.update', '更新角色')
  @ApiBody({ type: RoleUpdateDto })
  update(@Body() role: RoleUpdateDto) {
    return this.roleService.update(role);
  }
}
