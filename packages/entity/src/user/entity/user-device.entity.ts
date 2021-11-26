import { CommonEntity, Timestamp } from '@adachi-sakura/nest-shop-common';
import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@/user';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import UAParser from 'ua-parser-js';

@InterfaceType('UserAgentBrowser')
export class GraphQLUserAgentBrowser implements UAParser.IBrowser {
  @Field()
  major: string | undefined;
  @Field()
  name: string | undefined;
  @Field()
  version: string | undefined;
}
@InterfaceType('UserAgentCPU')
export class GraphQLUserAgentCPU implements UAParser.ICPU {
  @Field()
  architecture: string | undefined;
}
@InterfaceType('UserAgentDevice')
export class GraphQLUserAgentDevice implements UAParser.IDevice {
  @Field()
  model: string | undefined;
  @Field()
  type: string | undefined;
  @Field()
  vendor: string | undefined;
}
@InterfaceType('UserAgentEngine')
export class GraphQLUserAgentEngine implements UAParser.IEngine {
  @Field()
  name: string | undefined;
  @Field()
  version: string | undefined;
}
@InterfaceType('UserAgentOS')
export class GraphQLUserAgentOS implements UAParser.IOS {
  @Field()
  name: string | undefined;
  @Field()
  version: string | undefined;
}

@InterfaceType('UserAgent')
export class GraphQLUserAgent implements UAParser.IResult {
  @Field(() => GraphQLUserAgentBrowser)
  browser: UAParser.IBrowser;
  @Field(() => GraphQLUserAgentCPU)
  cpu: UAParser.ICPU;
  @Field(() => GraphQLUserAgentDevice)
  device: UAParser.IDevice;
  @Field(() => GraphQLUserAgentEngine)
  engine: UAParser.IEngine;
  @Field(() => GraphQLUserAgentOS)
  os: UAParser.IOS;
  @Field()
  ua: string;
}

@Entity('user_device')
@ObjectType('UserDevice')
export class UserDeviceEntity extends CommonEntity {
  @ApiProperty()
  @Field({
    description: '设备指纹',
  })
  @Column({
    comment: '设备指纹',
  })
  fingerprint: string;

  @ApiProperty()
  @Field({
    description: '设备名称',
  })
  @Column({
    comment: '设备名称',
  })
  name: string;

  @ApiProperty()
  @Field({
    description: '设备类型',
  })
  @Column({
    comment: '设备类型',
  })
  type: string;

  @ApiProperty()
  @Field(() => GraphQLUserAgent, {
    description: '设备UA',
  })
  @Column('json', {
    name: 'user_agent',
    comment: '设备UA',
  })
  userAgent: UAParser.IResult;

  @ApiProperty()
  @Field({
    description: '上次登陆时间',
  })
  @Column('timestamp', {
    name: 'last_login_at',
    comment: '上次登陆时间',
  })
  @Timestamp()
  lastLoginAt: Date;

  @ApiProperty()
  @Field({
    description: '上次登陆IP',
  })
  @Column({
    name: 'last_login_ip',
    comment: '上次登陆IP',
  })
  lastLoginIp: string;

  @ApiProperty()
  @Field({
    description: '设备首次登陆时间',
  })
  @Column('timestamp', {
    name: 'first_login_at',
    comment: '设备首次登陆时间',
  })
  @Timestamp()
  firstLoginAt: Date;

  @ApiProperty()
  @Field({
    description: '设备首次登陆IP',
  })
  @Column({
    name: 'first_login_ip',
    comment: '设备首次登陆IP',
  })
  firstLoginIp: string;

  @ApiProperty({ type: () => UserEntity })
  @Field(() => UserEntity, {
    description: '所属用户',
  })
  @ManyToOne(() => UserEntity, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
