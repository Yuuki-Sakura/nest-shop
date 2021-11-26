import { Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

export const create = <T>(clazz: Type<T>, source: any): T => {
  return plainToClass(clazz, JSON.parse(JSON.stringify(source)));
};
