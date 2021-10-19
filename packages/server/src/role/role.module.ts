import { Role } from '@adachi-sakura/nest-shop-entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionModule } from '@/permission/permission.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
