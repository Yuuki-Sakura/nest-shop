import { AppConfig } from '@/app.config';
import { create } from '@/common/utils/create.util';
import { AuthEnableOtpStep2ResultDto } from '@/auth/dto/otp/auth-enable-otp-step-2-result.dto';
import { AuthEnableOtpStep2Dto } from '@/auth/dto/otp/auth-enable-otp-step-2.dto';
import { AuthEnableOtpStep1ResultDto } from '@/auth/dto/otp/auth-enable-otp-step-1-result.dto';
import { UserRepository } from '@/user/user.repository';
import { CommonException } from '@adachi-sakura/nest-shop-common';
import { UserEntity } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { customAlphabet, nanoid } from 'nanoid';
import { authenticator, totp } from 'otplib';
import QRCode from 'qrcode-svg';

export class OtpService {
  @Inject()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly config: AppConfig;

  @InjectRedis()
  private readonly redis: Redis;

  async enableOtpStep1(user: UserEntity) {
    if (user.otpEnabledAt) {
      throw new CommonException({
        key: 'user.otp.error.enabled',
      });
    }
    const secret = authenticator.generateSecret();
    const enableToken = nanoid(20);
    await this.redis.set(
      enableToken,
      JSON.stringify({ secret, userId: user.id }),
      'EX',
      1800,
    );
    const accountName = (() => {
      if (user.primaryEmail) {
        return user.primaryEmail.email;
      } else if (user.primaryPhoneNumber) {
        return user.primaryPhoneNumber.phoneNumber;
      } else {
        return user.id;
      }
    })();
    const uri = totp.keyuri(accountName, 'nest shop', secret);
    return create(AuthEnableOtpStep1ResultDto, {
      secret,
      uri,
      qrcode: new QRCode({
        content: uri,
        join: true,
        container: 'svg-viewbox',
      }).svg(),
      enableToken,
    });
  }

  async enableOtpStep2(user: UserEntity, dto: AuthEnableOtpStep2Dto) {
    const otpInfo = await this.redis.get(dto.enableToken);
    if (!otpInfo) {
      throw new CommonException({
        key: 'user.otp.error.confirmTokenInvalid',
      });
    }
    const { secret, userId } = JSON.parse(
      await this.redis.get(dto.enableToken),
    );
    if (user.id != userId) {
      throw new CommonException({
        key: 'user.otp.error.unknown',
      });
    }
    if (!authenticator.check(dto.token, secret)) {
      throw new CommonException({
        key: 'user.otp.error.tokenInvalid',
      });
    }

    const backupCodes = (() => {
      const arr: string[] = [];
      const gen = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
      for (let i = 0; i < this.config.server.otp.backupCodeNumber || 5; i++) {
        arr.push(gen());
      }
      return arr;
    })();
    user.otpInfo = {
      secret,
      backupCodes,
    };
    user.otpEnabledAt = new Date();
    await this.userRepository.save(user);
    await this.redis.del(dto.enableToken);
    return create(AuthEnableOtpStep2ResultDto, {
      backupCodes,
    });
  }
}
