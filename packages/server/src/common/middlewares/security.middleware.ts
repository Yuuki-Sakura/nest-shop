import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { isProdMode } from '@/app.environment';
import { AppConfig } from '@/app.config';
import crypto from 'crypto';
import { CommonException } from '@adachi-sakura/nest-shop-common';
import { Span } from '@/common/decorator/span.decorator';

@Injectable()
@Span()
export class SecurityMiddleware implements NestMiddleware {
  @Inject()
  appConfig: AppConfig;

  use(req: Request, res: Response, next: () => void) {
    if (isProdMode) {
      const { method, originalUrl: url, body, query } = req;
      const clientSign = req.header('Signature');
      const timestamp = +req.header('Timestamp');

      if (!clientSign) {
        throw new CommonException(
          {
            key: 'common.security.signature.missing',
          },
          HttpStatus.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!timestamp) {
        throw new CommonException(
          {
            key: 'common.security.timestamp.missing',
          },
          HttpStatus.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      console.log(Date.now() - timestamp);
      if (
        Date.now() - timestamp >
        this.appConfig.server.security.rejectAfter * 1000
      ) {
        throw new CommonException(
          {
            key: 'common.security.timestamp.invalid',
          },
          HttpStatus.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const serverSign = crypto
        .createHash('sha256')
        .update(
          JSON.stringify({
            method,
            url,
            body,
            query,
            timestamp,
          }),
        )
        .digest('hex');

      if (clientSign != serverSign) {
        throw new CommonException(
          {
            key: 'common.security.signature.invalid',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    next();
  }
}
