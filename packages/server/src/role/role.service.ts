import { Span } from '@/common/decorator/span.decorator';
import { RoleUpdateDto } from '@/role/dto/role-update.dto';
import { RolePaginateConfig } from '@/role/paginate-config';
import { paginate, PaginateQuery } from '@adachi-sakura/nest-shop-common';
import { Role } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { RoleCreateDto } from '@/role/dto/role-create.dto';
import { Repository } from 'typeorm';

@Injectable()
@Span()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepo: Repository<Role>;

  @InjectRedis()
  private readonly redis: Redis;

  find(query: PaginateQuery = {}) {
    return paginate(query, this.roleRepo, RolePaginateConfig.find);
  }

  async findById(id: string) {
    return await this.roleRepo.findOneOrFail(id);
  }

  async create(role: RoleCreateDto) {
    return this.roleRepo.insert(this.roleRepo.create(role));
  }

  async update(role: RoleUpdateDto) {
    return this.roleRepo.save(role);
  }
}
