import { Transform } from 'class-transformer';
import jexl from 'jexl';
import { applyDecorators } from '@nestjs/common';
import Expression from 'jexl/Expression';

export const JexlExpression = () =>
  applyDecorators(
    Transform(({ value, type }) => {
      if (value)
        return type === 1
          ? (value as Expression)['_exprStr']
          : type === 0
          ? jexl.createExpression(value)
          : value;
    }),
  );
