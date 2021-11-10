import { UserService } from '@/user/user.service';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserEntity])
  async getUsers() {
    return await this.userService.findAll();
  }
}
