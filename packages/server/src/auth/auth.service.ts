import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '@/role/role.service';

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly roleService: RoleService;

  signToken({ id }: UserEntity) {
    return this.jwtService.sign({ id });
  }
}
