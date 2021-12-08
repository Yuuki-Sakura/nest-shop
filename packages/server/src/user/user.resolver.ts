import { GqlAuth } from '@/auth/auth.utils';
import { Span } from '@/common/decorator/span.decorator';
import {
  createGraphQLPaginateQuery,
  warpGqlPaginated,
} from '@/common/utils/warp-paginated';
import { UserService } from '@/user/user.service';
import { PaginateQuery } from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserPaginateConfig } from './paginate-config';
const findArgs = createGraphQLPaginateQuery(
  UserPaginateConfig.find,
  'FindUser',
);
const findResult = warpGqlPaginated(UserEntity, UserPaginateConfig.find);

@Resolver(() => UserEntity)
@Span()
export class UserResolver {
  @Inject()
  private readonly userService: UserService;

  @Query(() => findResult, {
    name: 'findUser',
  })
  @GqlAuth('user.find', '查找用户')
  async find(
    @Args('query', {
      type: () => findArgs,
      nullable: true,
    })
    query: PaginateQuery,
  ) {
    return await this.userService.find(query);
  }
}
