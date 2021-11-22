import { CommonException } from '@adachi-sakura/nest-shop-common';
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

  catch(
    exception: HttpException | CommonException | Error,
    host: ArgumentsHost,
  ) {
    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost['contextType'] == 'graphql') {
      return;
    }
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }
    if (exception instanceof CommonException) {
      if (exception.code) status = exception.code;
    }
    const stack = exception.stack;
    const data = {
      code: status,
      message: exception.message,
    };
    if (status === HttpStatus.FORBIDDEN) {
      data.message = '没有权限';
    }
    const content = request.method + ' -> ' + request.url;
    this.logger.error(
      `Error Response: ${content} HTTP/${request.httpVersion} ${status}}`,
      stack,
      'Response',
    );
    return response.status(status).jsonp(data);
  }
}

export const ExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
