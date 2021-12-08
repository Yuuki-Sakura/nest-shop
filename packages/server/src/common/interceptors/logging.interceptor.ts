/**
 * Logging interceptor.
 * @file 日志拦截器
 * @module interceptor/logging
 */

import { Span } from '@opentelemetry/api';
import { Observable } from 'rxjs';
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
    const contextType = gqlContext.getType();
    if (contextType == 'graphql') {
      const request = gqlContext.getContext().req;
      const span = request.span as Span;
      const info = gqlContext.getInfo();
      span.updateName(
        `GraphQLRequest: ${info.path.typename} -> ${info.path.key}`,
      );
      span.setAttributes({
        type: 'GraphQL',
        path: JSON.stringify(info.path),
        args: info.variableValues,
      });
      this.logger.log(
        `[request-at: ${request.requestAt}] GraphQLRequest: [${info.path.typename} -> ${info.path.key}]`,
        'GraphQLRequest',
      );
      return next.handle().pipe(
        tap(() => {
          span.end();
          this.logger.log(
            `[request-at: ${request.requestAt}] GraphQLResponse: [${
              info.path.typename
            } -> ${info.path.key}] time: ${Date.now() - request.requestAt}ms`,
            'GraphQLResponse',
          );
        }),
      );
    }
    const request = ctx.switchToHttp().getRequest();
    this.logger.log(
      `[request-at: ${request.requestAt}] Request: [${request.method} -> ${request.url}]`,
      'Request',
    );
    const span = request.span as Span;
    return next.handle().pipe(
      tap(() => {
        const response = ctx.switchToHttp().getResponse<Response>();
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
