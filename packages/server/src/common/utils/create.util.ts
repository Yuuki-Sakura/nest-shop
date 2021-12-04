import { Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

export const create = <T>(type: Type<T>, source: Partial<T>): T => {
  return plainToClass(type, JSON.parse(JSON.stringify(source)));
};
