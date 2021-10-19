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
  NestInterceptor,
} from '@nestjs/common';
import { isDevMode } from '@/app.environment';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Response } from 'express';
import { AppLogger } from '@/app.logger';
import { GqlExecutionContext } from '@nestjs/graphql';

export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(AppLogger) private readonly logger: AppLogger, // @Inject(HttpLogService) private readonly logService: HttpLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() == 'graphql') {
      return next.handle();
    }
    if (!isDevMode) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `Response: ${request.method} -> ${request.url} HTTP/${request.httpVersion} ${response.statusCode} ${request.headers['user-agent']}`,
        );
        // this.logService.create({
        //   method: request.method,
        //   url: request.originalUrl,
        //   status: response.statusCode,
        //   httpVersion: request.httpVersion,
        //   userAgent: request.headers['user-agent'],
        //   host: request.headers['host'],
        //   ip: request.ip,
        //   requestTime: new Date(Date.now()),
        //   headers: request.headers,
        // });
      }),
    );
  }
}

export const LoggingInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};
