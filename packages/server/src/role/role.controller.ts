import { Role } from '@adachi-sakura/nest-shop-entity';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from '@/role/role.service';
import { RoleUpdateDto } from '@/role/dto/role-update.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleCreateDto } from '@/role/dto/role-create.dto';
import { Auth } from '@/auth/auth.utils';
import { CommonController } from '@/common/controller/common.controller';
import {
  AfterInvoke,
  BeforeInvoke,
  EnableMethodListener,
} from '@/common/decorator/enable-method-listener.decorator';
import rTracer from 'cls-rtracer';

@ApiTags('角色')
@Controller('role')
@EnableMethodListener()
export class RoleController extends CommonController {
  constructor(private readonly roleService: RoleService) {
    super('RoleController');
  }

  @Get()
  @ApiResponse({ type: Role, isArray: true })
  findAll() {
    return this.roleService.findAll();
  }

  @Get('test')
  async test() {
    return await this.roleService.test();
  }

  @Get(':id')
  @ApiResponse({ type: Role })
  async findOne(@Param('id') id: string) {
    return await this.roleService.findById(id);
  }

  @Post()
  @Auth('role.create', '创建角色')
  @ApiBody({ type: RoleCreateDto })
  save(@Body() role: RoleCreateDto) {
    return this.roleService.save(role);
  }

  @Put(':id')
  @Auth('role.update', '更新角色')
  @ApiBody({ type: RoleUpdateDto })
  update(@Param('id') id: string, @Body() role: RoleUpdateDto) {
    return this.roleService.update(id, role);
  }
}
