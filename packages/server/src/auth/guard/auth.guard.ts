import { Span } from '@/common/decorator/span.decorator';
import { RedisKey } from '@/redis-key.constants';
import { CommonException } from '@adachi-sakura/nest-shop-common';
import { InjectRedis } from '@adachi-sakura/nestjs-redis';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IAuthModuleOptions } from '@nestjs/passport';
import { defaultOptions } from '@nestjs/passport/dist/options';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import passport from 'passport';

@Injectable()
@Span()
export class AuthGuard implements CanActivate {
  @InjectRedis()
  private readonly redisService: Redis;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request, response] = [
      this.getRequest<Request>(context),
      this.getResponse<Response>(context),
    ];
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) {
      throw new CommonException(
        {
          key: 'auth.pleaseLogin',
        },
        401,
      );
    }
    if (await this.redisService.zscore(RedisKey.Auth.ExpiredToken, token))
      throw new CommonException(
        {
          key: 'auth.tokenExpired',
        },
        401,
      );
    const options = {
      ...defaultOptions,
      ...(await this.getAuthenticateOptions(context)),
    };
    const passportFn = createPassportContext(request, response);
    request[options.property || defaultOptions.property] = await passportFn(
      'jwt',
      options,
      (err, user, info, status) =>
        this.handleRequest(err, user, info, context, status),
    );
    return true;
  }
  getRequest<T = any>(context: ExecutionContext): T {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() === 'graphql') {
      return gqlContext.getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  getResponse<T = any>(context: ExecutionContext): T {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() === 'graphql') {
      return gqlContext.getContext().req.res;
    }
    return context.switchToHttp().getResponse();
  }

  async logIn<TRequest extends { logIn: Function } = any>(
    request: TRequest,
  ): Promise<void> {
    const user = request[defaultOptions.property];
    await new Promise<void>((resolve, reject) =>
      request.logIn(user, (err) => (err ? reject(err) : resolve())),
    );
  }

  handleRequest<TUser = any>(err, user, info, context, status): TUser {
    if (err || !user) {
      throw (
        err ||
        new CommonException(
          {
            key: 'auth.unauthorized',
          },
          401,
        )
      );
    }
    return user;
  }

  getAuthenticateOptions(
    context: ExecutionContext,
  ): Promise<IAuthModuleOptions> | IAuthModuleOptions | undefined {
    return undefined;
  }
}
const createPassportContext =
  (request, response) => (type, options, callback: Function) =>
    new Promise<void>((resolve, reject) =>
      passport.authenticate(type, options, (err, user, info, status) => {
        try {
          request.authInfo = info;
          return resolve(callback(err, user, info, status));
        } catch (err) {
          reject(err);
        }
      })(request, response, (err) => (err ? reject(err) : resolve())),
    );
