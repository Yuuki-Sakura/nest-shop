import { isDevMode } from '@/app.environment';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Response } from 'express';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject()
  private readonly logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost['contextType'] == 'graphql') {
      return;
    }
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest();
    const status = exception.getStatus
      ? exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const stack = exception.stack;
    const data = {
      code: status,
      message: exception.message,
      stack: undefined,
    };
    if (status === HttpStatus.FORBIDDEN) {
      data.message = '没有权限';
    }
    const content = request.method + ' -> ' + request.url;
    this.logger.error(
      `Error Response: ${content} HTTP/${request.httpVersion} ${status} ${request.headers['user-agent']}`,
    );
    if (
      !(
        status === HttpStatus.NOT_FOUND ||
        status === HttpStatus.UNAUTHORIZED ||
        status === HttpStatus.FORBIDDEN
      ) &&
      isDevMode
    ) {
      data.stack = stack;
      this.logger.error(stack);
    }
    // this.logService.create({
    //   method: request.method,
    //   url: request.originalUrl,
    //   status: status,
    //   httpVersion: request.httpVersion,
    //   userAgent: request.headers['user-agent'],
    //   host: request.headers['host'],
    //   ip: request.ip,
    //   requestTime: new Date(Date.now()),
    //   headers: request.headers,
    // });
    return response.status(status).jsonp(data);
  }
}

export const ExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
