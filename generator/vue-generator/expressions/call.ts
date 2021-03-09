import SyntaxKind from "../../base-generator/syntaxKind";
import {
  Call as BaseCall,
  Identifier,
} from "../../base-generator/expressions/common";
import { toStringOptions } from "../types";
import { PropertyAccessChain } from "../../angular-generator/expressions/property-access-chain";
import syntaxKind from "../../base-generator/syntaxKind";
import { PropertyAssignment } from "../../base-generator/expressions/property-assignment";
import { SimpleExpression } from "../../base-generator/expressions/base";
import { ObjectLiteral } from "../../base-generator/expressions/literal";
export class Call extends BaseCall {
  compileTypeArguments() {
    return "";
  }
}
export class New extends Call {
  toString(options?: toStringOptions) {
    const componentInputs = options?.componentInputs || [];
    if (componentInputs.length) {
      const matchedInput = componentInputs.find(
        (c) => c.name === this.expression.toString()
      );
      if (matchedInput?.isNested) {
        const defaultValue = new PropertyAccessChain(
          this.expression,
          syntaxKind.QuestionDotToken,
          new Identifier("__defaultNestedValues()")
        );
        return defaultValue.toString();
      }
      if (matchedInput?.fields?.length && matchedInput?.fields?.length > 0) {
        const objectFields = matchedInput.fields.map(
          (prop) =>
            new PropertyAssignment(
              prop,
              new PropertyAccessChain(
                this.expression,
                syntaxKind.QuestionDotToken,
                new PropertyAccessChain(
                  prop,
                  syntaxKind.QuestionDotToken,
                  new SimpleExpression("default()")
                )
              )
            )
        );
        return new ObjectLiteral(objectFields, true).toString(options);
      }
      if (matchedInput) {
        return this.expression.toString();
      }
    }
    return `${SyntaxKind.NewKeyword} ${super.toString(options)}`;
  }
}
