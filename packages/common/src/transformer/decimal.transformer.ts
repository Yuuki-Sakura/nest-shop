import { Decimal } from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export const DecimalTransformer = (decimalPlaces = 2): ValueTransformer => ({
  to(value: Decimal): string {
    if (!value) return;
    return value.toFixed(decimalPlaces);
  },
  from(value: string): Decimal {
    return new Decimal(value);
  },
});
