import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { Decimal } from 'decimal.js';

export const ToDecimal = () => {
  const transformer = Transform(({ value, type }) => {
    if (value)
      return type === 1
        ? (value as Decimal).toJSON()
        : type === 0
        ? new Decimal(value)
        : value;
  });
  return applyDecorators(transformer);
};
