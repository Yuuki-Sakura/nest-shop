import { AppConfig } from '@/app.config';
import { AuthController } from '@/auth/auth.controller';
import { AuthResolver } from '@/auth/auth.resolver';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { RoleModule } from '@/role/role.module';
import { UserModule } from '@/user/user.module';
import { UserRepository } from '@/user/user.repository';
import {
  Role,
  UserDeviceEntity,
  UserPermission,
  UserRole,
} from '@adachi-sakura/nest-shop-entity';
import { UserEmailEntity } from '@adachi-sakura/nest-shop-entity/dist/user/entity/user-email.entity';
import { UserPhoneNumberEntity } from '@adachi-sakura/nest-shop-entity/dist/user/entity/user-phone-number.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: AppConfig) => config.jwt,
      inject: [AppConfig],
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserDeviceEntity,
      UserRole,
      Role,
      UserEmailEntity,
      UserPhoneNumberEntity,
      UserPermission,
    ]),
    UserModule,
    RoleModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
