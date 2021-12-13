import { DistrictResolver } from '@/district/district.resolver';
import { DistrictEntity } from '@adachi-sakura/nest-shop-entity';
import { Module } from '@nestjs/common';
import { DistrictService } from 'district/district.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictController } from 'district/district.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DistrictEntity])],
  providers: [DistrictService, DistrictResolver],
  controllers: [DistrictController],
  exports: [DistrictService],
})
export class DistrictModule {}
