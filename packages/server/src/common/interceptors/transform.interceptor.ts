/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 */

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
import * as META from '@adachi-sakura/nest-shop-common/src/constants/meta.constant';
import * as TEXT from '@adachi-sakura/nest-shop-common/src/constants/text.constant';
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
      this.reflector.get<string>(META.HTTP_SUCCESS_MESSAGE, target) ||
      TEXT.HTTP_DEFAULT_SUCCESS_TEXT;
    const statusCode = this.reflector.get<HttpStatus>(
      META.HTTP_ERROR_CODE,
      target,
    );
    return next.handle().pipe(
      map((data: any) => {
        const isString = typeof data === 'string';
        return {
          code: statusCode || context.switchToHttp().getResponse().statusCode,
          message: isString ? data : message,
          data: !isString ? data : undefined,
        };
      }),
    );
  }
}
