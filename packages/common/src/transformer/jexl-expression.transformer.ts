import jexl from 'jexl';
import Expression from 'jexl/dist/Expression';
import { ValueTransformer } from 'typeorm';

export const JexlExpressionTransformer: ValueTransformer = {
  to(value: Expression): string {
    return value['_exprStr'];
  },
  from(value: string): Expression {
    return jexl.createExpression(value);
  },
};
