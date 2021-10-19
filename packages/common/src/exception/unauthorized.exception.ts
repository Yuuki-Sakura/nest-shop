/**
 * HttpUnauthorized error.
 * @file 401 错误生成器
 * @module error/unauthorized
 */

import * as TEXT from '@/constants/text.constant';
import { UnauthorizedException } from '@nestjs/common';

/**
 * @class HttpUnauthorizedException
 * @classdesc 401 -> 未授权/权限验证失败
 * @example new HttpUnauthorizedError('错误信息')
 */
export class HttpUnauthorizedException extends UnauthorizedException {
  constructor(message?: string, error?: any) {
    super(message || TEXT.HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
  }
}
