/**
 * Transform interceptor.
 * @file 请求流拦截器
 * @module interceptor/transform
 */

import {
  CommonResponseMessage,
  CUSTOM_SUCCESS_MESSAGE_METADATA,
} from '@adachi-sakura/nest-shop-common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { ApiResponseProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class CommonResponse<T extends any> {
  @ApiResponseProperty({ example: 200 })
  code: number;
  @ApiResponseProperty()
  message: string;
  data?: T | 'OK';
}

/**
 * @class TransformInterceptor
 * @classdesc 当控制器所需的 Promise service 成功响应时，将在此被转换为标准的数据结构 THttpSuccessResponse
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  @Inject()
  private readonly logger: Logger;

  @Inject()
  private readonly i18n: I18nService;

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Promise<CommonResponse<T>> | CommonResponse<T> | T | 'OK'> {
    const ctx = context.switchToHttp();
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() == 'graphql')
      return next.handle().pipe(map((data) => data || 'OK'));
    const target = context.getHandler();
    return next.handle().pipe(
      map(async (data: T) => {
        const message: CommonResponseMessage = { key: 'common.success' };
        const messageKey: string = Reflect.getMetadata(
          CUSTOM_SUCCESS_MESSAGE_METADATA,
          target,
        );
        if (messageKey) message.key = messageKey;
        const statusCode =
          Reflect.getMetadata(HTTP_CODE_METADATA, target) ||
          context.switchToHttp().getResponse().statusCode;
        return {
          code: statusCode,
          message: await this.i18n.translate(message.key, {
            args: message.args || {},
            lang: ctx.getRequest().i18nLang,
          }),
          data: data || 'OK',
        };
      }),
    );
  }
}

export const TransformInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: TransformInterceptor,
};
