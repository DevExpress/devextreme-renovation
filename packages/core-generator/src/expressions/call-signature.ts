import { Parameter } from './functions';
import { TypeExpression } from './type';

export class CallSignature {
  constructor(
    public typeParameters: TypeExpression[] = [],
    public parameters: Parameter[] = [],
    public type: TypeExpression | string = 'unknown',
  ) {}

  toString() {
    return `(${this.parameters}): ${this.type}`;
  }
}
