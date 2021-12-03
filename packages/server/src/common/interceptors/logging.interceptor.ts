/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 */

import { context, Span, SpanStatusCode, trace } from '@opentelemetry/api';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

export class LoggingInterceptor implements NestInterceptor {
  @Inject()
  private readonly logger: Logger;

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(ctx);
    if (gqlContext.getType() == 'graphql') {
      return next.handle();
    }
    const request = ctx.switchToHttp().getRequest();
    this.logger.log(
      `[request-at: ${request.requestAt}] Request: [${request.method} -> ${request.url}]`,
      'Request',
    );
    const response = ctx.switchToHttp().getResponse<Response>();
    const span = request.span as Span;
    return next.handle().pipe(
      tap(() => {
        span.end();
        this.logger.log(
          `[request-at: ${request.requestAt}] Response: [${request.method} -> ${
            request.url
          }] code: ${response.statusCode} time: ${
            Date.now() - request.requestAt
          }ms`,
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
