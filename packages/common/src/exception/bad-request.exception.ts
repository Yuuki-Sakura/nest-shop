/**
 * HttpBadRequest error.
 * @file 400 错误生成器
 * @module error/bad-request
 */

import * as TEXT from '@/constants/text.constant';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @class HttpBadRequestHttpException
 * @classdesc 400 -> 请求不合法
 * @example new HttpBadRequestHttpException('错误信息')
 */
export class HttpBadRequestException extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_BAD_REQUEST_TEXT_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}
