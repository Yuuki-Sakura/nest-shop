import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import { Kind, ValueNode } from 'graphql';

@Scalar('Decimal', () => Decimal)
export class DecimalScalar implements CustomScalar<string, Decimal> {
  public description: string;

  public parseLiteral(ast: ValueNode): Decimal {
    if (ast.kind === Kind.STRING) {
      return new Decimal(ast.value);
    }
    return null;
  }

  public parseValue(value: string): Decimal {
    return new Decimal(value);
  }

  public serialize(value: Decimal | string): string {
    if (typeof value === 'string') return value;
    return value.toFixed();
  }
}
