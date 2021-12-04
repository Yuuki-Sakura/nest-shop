import { AuthService } from '@/auth/auth.service';
import {
  encryptPassword,
  getPermissions,
  verifyPassword,
} from '@/auth/auth.utils';
import { Span } from '@/common/decorator/span.decorator';
import { createDeviceHash } from '@/common/utils/create-device-hash';
import { create } from '@/common/utils/create.util';
import { UserLoginDto, UserLoginResultDto, UserRegisterDto } from '@/user/dto';
import { CommonException, nanoid } from '@adachi-sakura/nest-shop-common';
import { UserDeviceEntity, UserEntity } from '@adachi-sakura/nest-shop-entity';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { RoleService } from '@/role/role.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import UAParser from 'ua-parser-js';

@Injectable()
@Span()
export class UserService {
  @Inject()
  private readonly authService: AuthService;

  @Inject()
  private readonly roleService: RoleService;

  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly userRepository: UserRepository;

  @InjectRepository(UserDeviceEntity)
  private readonly userDeviceRepo: Repository<UserDeviceEntity>;

  @InjectRedis()
  private readonly redis: Redis;

  async findAll() {
    return await this.userRepository.find({});
  }

  async findById(id: string) {
    return this.userRepository.findOne(id);
  }

  async findOneByPhoneOrEmail(phoneOrEmail: string) {
    const user = await this.userRepository.findOneByPhoneOrEmail(phoneOrEmail);
    if (!user) {
      throw new NotFoundException('手机号或邮箱无效');
    }
    return user;
  }

  async login(
    { phone, email, password, fingerprint }: UserLoginDto,
    req: Request,
  ) {
    const user = await this.userRepository.findOneByPhoneOrEmail(phone, email);
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
    if (!userDevice) {
      userDevice = this.userDeviceRepo.create({
        user,
        userAgent,
        fingerprint: userDeviceHash,
        firstLoginIp: req.clientIp,
        lastLoginIp: req.clientIp,
        firstLoginAt: userLoginAt,
        lastLoginAt: userLoginAt,
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
      await this.userDeviceRepo.save(userDevice);
    }
    user.lastLoginIp = req.clientIp;
    user.lastLoginAt = userLoginAt;
    await this.userRepository.save(user);

    const userPermissions = getPermissions(
      await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id'])
        .where('user.id = :id', { id: user.id })
        .leftJoinAndSelect('user.roles', 'roles')
        .leftJoinAndSelect('roles.role', 'role')
        .leftJoinAndSelect('role.extends', 'role_extends')
        .leftJoinAndSelect('user.permissions', 'permissions')
        .getOne(),
    );

    await this.redis.set(
      `user-${user.id}-permissions`,
      JSON.stringify(userPermissions),
    );
    // console.log(userPermissions);
    const token = this.authService.signToken(user);
    return create(UserLoginResultDto, {
      ...user,
      token,
      permissions: userPermissions,
    });
  }

  async register(registerDto: UserRegisterDto): Promise<void> {
    if (!registerDto.phone && !registerDto.email) {
      throw new CommonException({
        key: 'user.register.fail.missingParameters',
      });
    }
    const user = await this.userRepository.findOneByPhoneOrEmail(
      registerDto.phone,
      registerDto.email,
    );
    if (user) {
      throw new CommonException({ key: 'user.register.fail.exists' }, 400);
    }
    const password = await encryptPassword(registerDto.password);
    const result = await this.userRepository.insert(
      this.userRepository.create({
        ...registerDto,
        password,
        nickname: registerDto.nickname || registerDto.email || nanoid(10),
      }),
    );
    if (result.identifiers.length === 0) {
      throw new CommonException({ key: 'common.fail.unknown' }, 500);
    }
  }

  logout(user: UserEntity, token: string) {
    console.log(
      this.jwtService.decode(token, {
        complete: true,
      }),
    );
    return this.redis.zadd('expired-token', Date.now(), token);
  }
}
