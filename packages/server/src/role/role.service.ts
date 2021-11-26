import { Role } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleCreateDto } from '@/role/dto/role-create.dto';
import { PermissionService } from '@/permission/permission.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { CommonService } from '@/common/service/common.service';
import { EnableMethodListener } from '@/common/decorator/enable-method-listener.decorator';

@Injectable()
@EnableMethodListener()
export class RoleService extends CommonService {
  constructor() {
    super('RoleService');
  }

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;
  @Inject()
  private readonly permissionService: PermissionService;

  @InjectRedis()
  private readonly redis: Redis;

  findById(id: string) {
    return this.roleRepository.findOne(id, { relations: ['permissions'] });
  }

  findByIds(ids: string[]) {
    return this.roleRepository.findByIds(ids, { relations: ['permissions'] });
  }

  findOneByName(name: string) {
    return this.roleRepository.findOne(
      { name },
      { relations: ['permissions'] },
    );
  }

  findAll() {
    return this.roleRepository.find();
  }

  find(options?: FindManyOptions<Role>): Promise<Role[]>;
  find(conditions?: FindConditions<Role>): Promise<Role[]>;
  find(options?) {
    return this.roleRepository.find(options);
  }

  findByUser(userId: string) {
    return this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'users')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('users.id = :userId', { userId })
      .getMany();
  }

  async save(role: RoleCreateDto) {
    return this.roleRepository.save(
      Object.assign(new Role(), {
        name: role.name,
        permissions: await this.permissionService.findByIds(role.permissionIds),
      }) as Role,
    );
  }

  async test() {
    await this.redis.set('test', 'test');
    await this.redis.get('test');
    await this.redis.del('test');
    await this.roleRepository.findOne();
    return 'test';
  }
}
