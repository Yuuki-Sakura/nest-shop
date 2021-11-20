/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 */

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { isDevMode } from '@/app.environment';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

export class LoggingInterceptor implements NestInterceptor {
  @Inject()
  private readonly logger: Logger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() == 'graphql') {
      return next.handle();
    }
    if (!isDevMode) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    this.logger.log(
      `Request: ${request.method} -> ${request.url} HTTP/${request.httpVersion}`,
    );
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `Response: ${request.method} -> ${request.url} time: ${
            Date.now() - now
          }ms HTTP/${request.httpVersion} ${response.statusCode}`,
        );
      }),
    );
  }
}

export const LoggingInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};
