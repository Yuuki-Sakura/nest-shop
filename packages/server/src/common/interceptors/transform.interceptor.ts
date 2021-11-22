/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 */

import { CUSTOM_SUCCESS_MESSAGE_METADATA } from '@adachi-sakura/nest-shop-common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type TResponse<T> = {
  code: HttpStatus;
  message: string;
  data?: T;
};

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 THttpSuccessResponse
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TResponse<T> | T> {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() == 'graphql') return next.handle();
    const target = context.getHandler();
    const message =
      this.reflector.get<string>(CUSTOM_SUCCESS_MESSAGE_METADATA, target) ||
      'success';
    const statusCode =
      this.reflector.get<HttpStatus>(HTTP_CODE_METADATA, target) ||
      context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data: T) => ({
        code: statusCode,
        message: message,
        data,
      })),
    );
  }
}
