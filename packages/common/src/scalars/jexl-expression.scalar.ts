import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import jexl from 'jexl';
import Expression from 'jexl/dist/Expression';

export const JexlExpressionScalar = new GraphQLScalarType({
  description: undefined,
  name: 'JexlExpression',
  parseLiteral(ast: ValueNode): Expression {
    if (ast.kind === Kind.STRING) {
      return jexl.createExpression(ast.value);
    }
    return null;
  },
  parseValue(value: string): Expression {
    return jexl.createExpression(value);
  },
  serialize(value: Expression): string {
    return value['_exprStr'];
  },
});
