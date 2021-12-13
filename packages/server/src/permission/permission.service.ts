import { PermissionCreateDto } from '@/permission/dto/permission-create.dto';
import { PermissionUpdateDto } from '@/permission/dto/permission-update.dto';
import { PermissionPaginateConfig } from '@/permission/paginate-config';
import { paginate, PaginateQuery } from '@adachi-sakura/nest-shop-common';
import { Permission } from '@adachi-sakura/nest-shop-entity';
import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
export class PermissionService {
  @InjectRepository(Permission)
  private readonly permissionRepo: Repository<Permission>;

  find(query: PaginateQuery = {}) {
    return paginate(query, this.permissionRepo, PermissionPaginateConfig.find);
  }

  findOne(conditions?: FindConditions<Permission>) {
    return this.permissionRepo.findOne(conditions);
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
