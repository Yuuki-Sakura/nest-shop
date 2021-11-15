import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import jexl from 'jexl';
import Expression from 'jexl/Expression';

@Scalar('Expression', () => Expression)
export class JexlExpressionScalar implements CustomScalar<string, Expression> {
  public description: string;

  public parseLiteral(ast: ValueNode): Expression {
    if (ast.kind === Kind.STRING) {
      return jexl.createExpression(ast.value);
    }
    return null;
  }

  public parseValue(value: string): Expression {
    return jexl.createExpression(value);
  }

  public serialize(value: Expression): string {
    return value['_exprStr'];
  }
}
