/**
 * Cors middleware.
 * @file CORS 中间件
 * @module middleware/cors
 */

import { Request, Response } from 'express';
import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  RequestMethod,
} from '@nestjs/common';
import { isDevMode } from '@/app.environment';

/**
 * @class CorsMiddleware
 * @classdesc 用于处理 CORS 跨域
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next) {
    const getMethod = (method) => RequestMethod[method];
    const origins = request.headers.origin;
    const origin = (Array.isArray(origins) ? origins[0] : origins) || '';

    const allowOrigins = [...JSON.parse(process.env.ALLOW_ORIGINS)];
    const allowMethods = [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.PUT,
      RequestMethod.PATCH,
      RequestMethod.POST,
      RequestMethod.DELETE,
    ];
    const allowHeaders = [
      'Authorization',
      'Origin',
      'No-Cache',
      'X-Requested-With',
      'If-Modified-Since',
      'Pragma',
      'Last-Modified',
      'Cache-Control',
      'Expires',
      'Content-Type',
      'X-E4M-With',
    ];

    // Allow Origin
    if (!origin || allowOrigins.includes(origin) || isDevMode) {
      response.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    // Headers
    response.header('Access-Control-Allow-Headers', allowHeaders.join(','));
    response.header(
      'Access-Control-Allow-Methods',
      allowMethods.map(getMethod).join(','),
    );
    response.header('Access-Control-Max-Age', '1728000');
    response.header('Content-Type', 'application/json; charset=utf-8');

    // OPTIONS Request
    if (request.method === getMethod(RequestMethod.OPTIONS)) {
      return response.sendStatus(HttpStatus.NO_CONTENT);
    } else {
      return next();
    }
  }
}
