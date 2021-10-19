import { Controller, Get, Param } from '@nestjs/common';
import { PermissionService } from '@/permission/permission.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('权限')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.permissionService.findById(id);
  }
}
