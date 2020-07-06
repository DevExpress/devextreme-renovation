import { ArrowFunction as AngularArrowFunction } from "../../../angular-generator/expressions/functions/arrow-function";
import { processFunctionTemplate } from "./function";
import {
  SimpleTypeExpression,
  TypeExpression,
} from "../../../base-generator/expressions/type";
import { GeneratorContext } from "../../../base-generator/types";
import { Block } from "../../../base-generator/expressions/statements";
import { Expression } from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../types";
import { Parameter } from "./parameter";

export class ArrowFunction extends AngularArrowFunction {
  constructor(
    modifiers: string[] | undefined,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    equalsGreaterThanToken: string,
    body: Block | Expression,
    context: GeneratorContext
  ) {
    super(
      modifiers,
      typeParameters,
      parameters,
      new SimpleTypeExpression(""),
      equalsGreaterThanToken,
      body,
      context
    );
  }

  getTemplate(options?: toStringOptions, doNotChangeContext?: boolean): string {
    return processFunctionTemplate(
      super.getTemplate(options, doNotChangeContext),
      this.context,
      options
    );
  }
}
