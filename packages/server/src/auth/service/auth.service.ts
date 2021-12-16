import {
  encryptPassword,
  getPermissions,
  verifyPassword,
} from '@/auth/auth.utils';
import { AuthPermissionDto } from '@/auth/dto/auth-permission.dto';
import { AuthRoleDto } from '@/auth/dto/auth-role.dto';
import { Span } from '@/common/decorator/span.decorator';
import { createDeviceHash } from '@/common/utils/create-device-hash';
import { create } from '@/common/utils/create.util';
import { AuthLoginDto, AuthLoginResultDto, AuthRegisterDto } from '@/auth/dto';
import { UserRepository } from '@/user/user.repository';
import { CommonException, nanoid } from '@adachi-sakura/nest-shop-common';
import {
  Role,
  UserDeviceEntity,
  UserEmailEntity,
  UserEntity,
  UserPermission,
  UserPhoneNumberEntity,
  UserRole,
} from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '@/role/role.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import UAParser from 'ua-parser-js';
import { AuthRefreshResultDto } from '@/auth/dto';

@Injectable()
@Span()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly roleService: RoleService;

  @Inject()
  private readonly userRepository: UserRepository;

  @InjectRepository(UserDeviceEntity)
  private readonly userDeviceRepo: Repository<UserDeviceEntity>;

  @InjectRepository(UserEmailEntity)
  private readonly userEmailRepo: Repository<UserEmailEntity>;

  @InjectRepository(UserPhoneNumberEntity)
  private readonly userPhoneNumberRepo: Repository<UserPhoneNumberEntity>;

  @InjectRepository(Role)
  private readonly roleRepo: Repository<Role>;

  @InjectRepository(UserRole)
  private readonly userRoleRepo: Repository<UserRole>;

  @InjectRepository(UserPermission)
  private readonly userPermissionRepo: Repository<UserPermission>;

  @InjectRedis()
  private readonly redis: Redis;

  signToken({ id }: UserEntity) {
    return this.jwtService.sign({ id });
  }

  async login(
    { phoneNumber, email, password, fingerprint }: AuthLoginDto,
    req: Request,
  ) {
    const user = await this.userRepository.findOneByPhoneOrEmail(
      phoneNumber,
      email,
    );
    if (!user) {
      throw new CommonException(
        { key: 'user.login.accountOrPasswordFail' },
        400,
      );
    }
    const lockTime = await this.redis.ttl(`${user.id}-login-locked`);
    if (lockTime >= 0) {
      throw new CommonException({
        key: 'user.login.accountLocked',
        args: {
          time: lockTime,
        },
      });
    }
    const userLoginAt = new Date();
    const userDeviceHash =
      fingerprint || createDeviceHash(req, { user_id: user.id });
    if (!(await verifyPassword(user.password, password))) {
      const failCount = await this.redis.incr(`${user.id}-login-fail-count`);
      if (failCount >= 3) {
        await this.redis.set(
          `${user.id}-login-locked`,
          1,
          'EX',
          (failCount - 2) * 30,
          'NX',
        );
      }
      throw new CommonException(
        { key: 'user.login.accountOrPasswordFail' },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.redis.del(`${user.id}-login-fail-count`);

    const userAgent = UAParser(req.header('user-agent'));
    let userDevice = await this.userDeviceRepo.findOne({
      user,
      fingerprint: userDeviceHash,
    });
    const token = this.signToken(user);
    if (!userDevice) {
      userDevice = this.userDeviceRepo.create({
        user,
        userAgent,
        fingerprint: userDeviceHash,
        firstLoginIp: req.clientIp,
        lastLoginIp: req.clientIp,
        firstLoginAt: userLoginAt,
        lastLoginAt: userLoginAt,
        token,
        name: !userAgent.device.vendor
          ? `${userAgent.os.name} ${userAgent.os.version} ${userAgent.cpu.architecture}`
          : `${userAgent.device.vendor} ${userAgent.device.model}` +
            (userAgent.browser.name ? ` ${userAgent.browser.name}` : '') +
            ` ${userAgent.os.name} ${userAgent.os.version}`,
        type: !userAgent.device.vendor
          ? `${userAgent.os.name} ${userAgent.os.version} ${userAgent.cpu.architecture}`
          : `${userAgent.device.vendor} ${userAgent.device.model} ${userAgent.os.name} ${userAgent.os.version}`,
      });
      await this.userDeviceRepo.insert(userDevice);
    } else {
      userDevice.lastLoginIp = req.clientIp;
      userDevice.lastLoginAt = userLoginAt;
      userDevice.token = token;
      await this.userDeviceRepo.save(userDevice);
    }
    user.lastLoginIp = req.clientIp;
    user.lastLoginAt = userLoginAt;
    await this.userRepository.save(user);
    const userWithRole = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .leftJoinAndSelect('user.roles', 'user_role')
      .leftJoinAndSelect('user_role.role', 'role')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .where('user.id = :id', { id: user.id })
      .cache(true)
      .getOne();
    const userPermissions = getPermissions(userWithRole);

    await this.redis.set(
      `user-${user.id}-permissions`,
      JSON.stringify(userPermissions),
    );
    return create(AuthLoginResultDto, {
      user,
      token,
      permissions: userPermissions,
    });
  }

  async register(
    registerDto: AuthRegisterDto,
    req?: Request,
  ): Promise<AuthLoginResultDto | void> {
    if (!registerDto.phoneNumber && !registerDto.email) {
      throw new CommonException({
        key: 'user.register.fail.missingParameters',
      });
    }
    {
      const user = await this.userRepository.findOneByPhoneOrEmail(
        registerDto.phoneNumber,
        registerDto.email,
      );
      if (user) {
        throw new CommonException({ key: 'user.register.fail.exists' }, 400);
      }
    }
    const password = await encryptPassword(registerDto.password);
    const user = await this.userRepository.save(
      this.userRepository.create({
        password,
        nickname: registerDto.nickname || registerDto.email || nanoid(10),
      }),
    );
    if (registerDto.email) {
      const userEmail = this.userEmailRepo.create({
        user,
        isPrimary: true,
        email: registerDto.email,
      });
      const result = await this.userEmailRepo.insert(userEmail);
      if (result.identifiers.length === 0) {
        throw new CommonException({ key: 'common.fail.unknown' }, 500);
      }
      user.primaryEmail = userEmail;
      await this.userRepository.save(user);
    }
    if (registerDto.phoneNumber) {
      const userPhoneNumber = this.userPhoneNumberRepo.create({
        user,
        isPrimary: true,
        phoneNumber: registerDto.phoneNumber,
      });
      const result = await this.userPhoneNumberRepo.insert(userPhoneNumber);
      if (result.identifiers.length === 0) {
        throw new CommonException({ key: 'common.fail.unknown' }, 500);
      }
      user.primaryPhoneNumber = userPhoneNumber;
      await this.userRepository.save(user);
    }
    if (registerDto.andLogin) {
      return this.login(
        {
          phoneNumber: registerDto.phoneNumber,
          email: registerDto.email,
          password: registerDto.password,
          fingerprint: registerDto.fingerprint,
        },
        req,
      );
    }
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token, {
      complete: true,
    }) as {
      header: Record<string, string>;
      payload: Record<string, string | number>;
      signature: string;
    };
    await this.redis.zadd('expired-token', decoded.payload.exp, token);
    return 'OK';
  }

  async refresh(token: string) {
    const decoded = this.jwtService.decode(token, {
      complete: true,
    }) as {
      header: Record<string, string>;
      payload: Record<string, string | number>;
      signature: string;
    };
    const { exp, id } = decoded.payload;
    await this.redis.zadd('expired-token', exp, token);
    return create(AuthRefreshResultDto, {
      token: this.jwtService.sign({ id }),
    });
  }

  async permission(dto: AuthPermissionDto) {
    await this.userPermissionRepo.save(
      this.userPermissionRepo.create({
        user: await this.userRepository.findOne({ id: dto.userId }),
        permissions: dto.permissions,
        expiresAt: dto.expiresAt,
      }),
    );
  }

  async role(dto: AuthRoleDto) {
    await this.userRoleRepo.save(
      this.userRoleRepo.create({
        user: await this.userRepository.findOne({ id: dto.userId }),
        role: await this.roleRepo.findOne({ id: dto.roleId }),
        expiresAt: dto.expiresAt,
      }),
    );
  }
}
