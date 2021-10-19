import { Permission } from '@adachi-sakura/nest-shop-entity';
import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PermissionCreateDto } from '@/permission/dto/permission-create.dto';
import { PermissionUpdateDto } from '@/permission/dto/permission-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  findAll() {
    return this.permissionRepo.find();
  }

  findById(id: string) {
    return this.permissionRepo.findOne({ id });
  }

  findByName(name: string) {
    return this.permissionRepo.findOne({ name });
  }

  findOne(conditions?: FindConditions<Permission>) {
    return this.permissionRepo.findOne(conditions);
  }

  findByIds(ids: string[]) {
    return this.permissionRepo.findByIds(ids);
  }

  save(permission: PermissionCreateDto) {
    return this.permissionRepo.save({
      ...this.permissionRepo.create(),
      ...permission,
    });
  }

  update(id: string, permission: PermissionUpdateDto): Promise<UpdateResult> {
    return this.permissionRepo.update(id, permission);
  }

  delete(id: string | string[]): Promise<DeleteResult> {
    return this.permissionRepo.delete(id);
  }

  async clear() {
    const ids: string[] = [];
    (await this.permissionRepo.find()).forEach((prem) => ids.push(prem.id));
    return ids.length === 0 ? undefined : this.permissionRepo.delete(ids);
  }
}
