import { UserResolver } from '@/user/user.resolver';
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { RoleModule } from '@/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
