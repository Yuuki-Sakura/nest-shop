import { Type } from '@nestjs/common';
import { defaults } from 'lodash';

export const create = <T>(clazz: Type<T>, source): T => {
  return defaults(new clazz(), source);
};
