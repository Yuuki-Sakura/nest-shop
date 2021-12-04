import { UserResolver } from '@/user/user.resolver';
import { UserDeviceEntity, UserRole } from '@adachi-sakura/nest-shop-entity';
import { UserEmailEntity } from '@adachi-sakura/nest-shop-entity/dist/user/entity/user-email.entity';
import { UserPhoneNumberEntity } from '@adachi-sakura/nest-shop-entity/dist/user/entity/user-phone-number.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { RoleModule } from '@/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserDeviceEntity,
      UserRole,
      UserEmailEntity,
      UserPhoneNumberEntity,
    ]),
    forwardRef(() => AuthModule),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
