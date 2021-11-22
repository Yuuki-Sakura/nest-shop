/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 */

import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
    request.requestAt = Date.now();
    this.logger.log(
      `Request: ${request.method} -> ${request.url} HTTP/${request.httpVersion}`,
      'Request',
    );
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      }),
      tap(() => {
        this.logger.log(
          `Response: ${request.method} -> ${request.url} HTTP/${
            request.httpVersion
          } ${response.statusCode} time: ${Date.now() - now}ms`,
          'Response',
        );
      }),
    );
  }
}

export const LoggingInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};
