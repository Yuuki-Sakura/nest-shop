import { Auth } from '@/auth/auth.utils';
import { Span } from '@/common/decorator/span.decorator';
import {
  createSwaggerPaginateQuery,
  warpPaginated,
} from '@/common/utils/warp-paginated';
import { warpResponse } from '@/common/utils/warp-response';
import { UserPaginateConfig } from '@/user/paginate-config';
import { Paginate, PaginateQuery } from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('user')
@Controller('/user')
@Span()
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get()
  @ApiQuery({
    type: createSwaggerPaginateQuery(UserPaginateConfig.find),
  })
  @ApiOkResponse({
    type: warpResponse({
      type: warpPaginated({ type: UserEntity }, UserPaginateConfig.find),
    }),
  })
  @Auth('user.find', '查找用户')
  find(@Paginate() query: PaginateQuery, @Req() req: Request) {
    return this.userService.find(query);
  }
}
