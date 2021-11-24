import {
  CommonException,
  CommonResponseMessage,
} from '@adachi-sakura/nest-shop-common';
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
import { I18nService } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject()
  private readonly logger: Logger;

  @Inject()
  private readonly i18n: I18nService;

  async catch(
    exception: HttpException | CommonException | Error,
    host: ArgumentsHost,
  ) {
    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost['contextType'] == 'graphql') {
      return;
    }
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = exception.message;
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      code = httpStatus;
      message = exception.getResponse();
    }
    if (exception instanceof CommonException) {
      if (exception.code) code = exception.code;
      const msg = exception.getResponse() as CommonResponseMessage;
      message = await this.i18n.translate(msg.key, {
        args: msg.args,
        lang: request.i18nLang,
      });
    }
    const data = {
      code,
      message,
    };
    if (httpStatus === HttpStatus.FORBIDDEN) {
      data.message = await this.i18n.translate('common.FORBIDDEN', {
        args: {
          method: request.method,
          url: request.url,
        },
        lang: request.i18nLang,
      });
    }
    this.logger.error(
      `[request-at: ${request.requestAt}] Response: [${request.method} -> ${
        request.url
      }] http-status: ${httpStatus}  error-code: ${code} time: ${
        Date.now() - request.requestAt
      }ms`,
      exception.stack,
      'Response',
    );
    return response.status(httpStatus).jsonp(data);
  }
}

export const ExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
