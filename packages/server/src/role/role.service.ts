import { Role } from '@adachi-sakura/nest-shop-entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleUpdateDto } from '@/role/dto/role-update.dto';
import { RoleCreateDto } from '@/role/dto/role-create.dto';
import { PermissionService } from '@/permission/permission.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
  ) {}
  private readonly logger = new Logger('RoleService');

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

  async update(id: string, roleDto: RoleUpdateDto) {
    const role = await this.roleRepository.findOne(id);
    if (!role) throw new BadRequestException('角色Id无效');
    return this.roleRepository.save(
      Object.assign({}, role, {
        name: roleDto.name,
        permissions: await this.permissionService.findByIds(
          roleDto.permissionIds,
        ),
      }) as Role,
    );
  }
}
