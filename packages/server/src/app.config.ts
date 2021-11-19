import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { NestApplicationOptions } from '@nestjs/common';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import { GqlModuleOptions } from '@nestjs/graphql';
import { JwtModuleOptions } from '@nestjs/jwt';
import { SwaggerCustomOptions } from '@nestjs/swagger';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ContentSecurityPolicyOptions } from 'helmet/dist/middlewares/content-security-policy';
import { CrossOriginOpenerPolicyOptions } from 'helmet/dist/middlewares/cross-origin-opener-policy';
import { CrossOriginResourcePolicyOptions } from 'helmet/dist/middlewares/cross-origin-resource-policy';
import { ExpectCtOptions } from 'helmet/dist/middlewares/expect-ct';
import { ReferrerPolicyOptions } from 'helmet/dist/middlewares/referrer-policy';
import { StrictTransportSecurityOptions } from 'helmet/dist/middlewares/strict-transport-security';
import { XDnsPrefetchControlOptions } from 'helmet/dist/middlewares/x-dns-prefetch-control';
import { XFrameOptionsOptions } from 'helmet/dist/middlewares/x-frame-options';
import { XPermittedCrossDomainPoliciesOptions } from 'helmet/dist/middlewares/x-permitted-cross-domain-policies';

interface HelmetOptions {
  contentSecurityPolicy?: ContentSecurityPolicyOptions | boolean;
  crossOriginEmbedderPolicy?: boolean;
  crossOriginOpenerPolicy?: CrossOriginOpenerPolicyOptions | boolean;
  crossOriginResourcePolicy?: CrossOriginResourcePolicyOptions | boolean;
  dnsPrefetchControl?: XDnsPrefetchControlOptions | boolean;
  expectCt?: ExpectCtOptions | boolean;
  frameguard?: XFrameOptionsOptions | boolean;
  hidePoweredBy?: boolean;
  hsts?: StrictTransportSecurityOptions | boolean;
  ieNoOpen?: boolean;
  noSniff?: boolean;
  originAgentCluster?: boolean;
  permittedCrossDomainPolicies?: XPermittedCrossDomainPoliciesOptions | boolean;
  referrerPolicy?: ReferrerPolicyOptions | boolean;
  xssFilter?: boolean;
}

export class AppConfig {
  database: TypeOrmModuleOptions;
  redis: RedisModuleOptions;
  swagger: {
    prefix: string;
  } & SwaggerCustomOptions;
  server: {
    port: number;
    prefix: string;
    nest: NestApplicationOptions;
    helmet: HelmetOptions;
    allowOrigins: string[];
    allowReferer: string;
  };
  graphql: GqlModuleOptions;
  jwt: JwtModuleOptions;
  elasticsearch: ElasticsearchModuleOptions;
}
