import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from '@/role/role.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: +process.env.JWT_EXPIRES },
    }),
    forwardRef(() => UserModule),
    RoleModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
