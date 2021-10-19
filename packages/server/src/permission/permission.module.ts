import { Permission } from '@adachi-sakura/nest-shop-entity';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
