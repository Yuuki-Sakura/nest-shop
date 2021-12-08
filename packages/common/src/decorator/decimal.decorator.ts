import { Transform } from 'class-transformer';
import { Decimal } from 'decimal.js';

export const ToDecimal = () => {
  return Transform(({ value, type }) => {
    if (value)
      return type === 1
        ? (value as Decimal).toJSON()
        : type === 0
        ? new Decimal(value)
        : value;
  });
};
