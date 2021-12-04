// noinspection JSConstantReassignment

import { CommonResponse } from '@/common/interceptors/transform.interceptor';
import { Type } from '@nestjs/common';
import {
  ApiPropertyOptions,
  ApiResponseProperty,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';

type ApiResponseMetadata<T> = Pick<
  ApiPropertyOptions,
  'example' | 'format' | 'enum' | 'deprecated'
> & {
  type: Type<T> | Function | [Function] | string | Record<string, any>;
};

export const warpResponse = <T, U extends Type<CommonResponse<T>>>(
  options: ApiResponseMetadata<T>,
): U => {
  const typeName = (() => {
    if (typeof options.type === 'string') {
      return options.type;
    } else if (options.type instanceof Array) {
      return options.type[0].name;
    } else {
      return options.type.name;
    }
  })();
  class TempClass<T> extends CommonResponse<T> {
    @ApiResponseProperty(options)
    data: T;
  }
  Object.defineProperty(TempClass, 'name', { writable: true });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TempClass.name = `${CommonResponse.name}<${typeName}>`;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return TempClass;
};
