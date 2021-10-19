/**
 * Validation pipe.
 * @file 数据表验证器
 * @module pipe/validation
 */

import { ValidationException } from '@adachi-sakura/nest-shop-common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的地方的 class 模型
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints).join(';'))
        .join(';');
      throw new ValidationException(errorMessage);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
