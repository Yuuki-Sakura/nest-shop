import { CommonException } from '@adachi-sakura/nest-shop-common';
import { DistrictEntity } from '@adachi-sakura/nest-shop-entity';
import { Injectable } from '@nestjs/common';
import LRUCache from 'lru-cache';
import { TreeRepository } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm/connection/Connection';

@Injectable()
export class DistrictService {
  private readonly districtRepo: TreeRepository<DistrictEntity>;

  private readonly cache = new LRUCache<
    string,
    DistrictEntity | DistrictEntity[]
  >();

  constructor(
    @InjectConnection()
    connection: Connection,
  ) {
    this.districtRepo = connection.getTreeRepository(DistrictEntity);
  }

  async findChildren(parentId?: number) {
    if (!parentId) {
      return this.districtRepo.find({
        where: {
          parent: null,
        },
        cache: true,
      });
    }
    return this.districtRepo.find({
      where: { parent: { id: parentId } },
      cache: true,
    });
  }

  async findDescendants(parentId?: number) {
    if (!parentId) {
      const cacheResult = this.cache.get(`descendants`);
      if (cacheResult) return cacheResult;
      const result = await this.districtRepo.findTrees({
        depth: 3,
      });
      this.cache.set(`descendants`, result);
      return result;
    }
    const cacheResult = this.cache.get(`${parentId}-descendants`);
    if (cacheResult) return cacheResult;
    const current = await this.districtRepo.findOne(parentId);
    if (!current) {
      throw new CommonException({
        key: 'district.notFound',
      });
    }
    const result = await this.districtRepo.findDescendantsTree(current, {
      depth: 3,
    });
    this.cache.set(`${parentId}-descendants`, result);
    return result;
  }

  async findAncestors(childrenId: number) {
    const cacheResult = this.cache.get(`${childrenId}-ancestors`);
    if (cacheResult) return cacheResult;
    const current = await this.districtRepo.findOne(childrenId);
    if (!current) {
      throw new CommonException({
        key: 'district.notFound',
      });
    }
    const result = await this.districtRepo.findAncestorsTree(current);
    this.cache.set(`${childrenId}-ancestors`, result);
  }
}
