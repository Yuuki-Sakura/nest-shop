import { Span } from '@/common/decorator/span.decorator';
import { DistrictService } from '@/district/district.service';
import { DistrictEntity } from '@adachi-sakura/nest-shop-entity';
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@Resolver(() => DistrictEntity)
@Span()
export class DistrictResolver {
  @Inject()
  private readonly districtService: DistrictService;

  @Query(() => DistrictEntity, {
    name: 'findDistrict',
  })
  async find(
    @Args('parentId', {
      type: () => GraphQLString,
      nullable: true,
    })
    id: string,
  ) {
    return this.districtService.findChildren(id && +id);
  }

  @Query(() => DistrictEntity, {
    name: 'findDistrictTreeDescendants',
  })
  async findTreeDescendants(
    @Args('parentId', {
      type: () => GraphQLString,
      nullable: true,
    })
    id: string,
  ) {
    return this.districtService.findDescendants(id && +id);
  }

  @Query(() => DistrictEntity, {
    name: 'findDistrictTreeAncestors',
  })
  async findTreeAncestors(
    @Args('childrenId', {
      type: () => GraphQLString,
      nullable: true,
    })
    id: string,
  ) {
    return this.districtService.findAncestors(id && +id);
  }
}
