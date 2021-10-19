/**
 * Validation error.
 * @file 400 错误生成器
 * @module error/validation
 */

import * as TEXT from '@/constants/text.constant';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @class ValidationException
 * @classdesc 400 -> 请求有问题，这个错误经常发生在错误内层，所以 code 没有意义
 * @example new ValidationError('错误信息')
 * @example new ValidationError(new Error())
 */
export class ValidationException extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.VALIDATION_ERROR_DEFAULT, HttpStatus.BAD_REQUEST);
  }
}
