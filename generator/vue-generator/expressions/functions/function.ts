import { Function as AngularFunction } from "../../../angular-generator/expressions/functions/function";
import { Decorator } from "../../../base-generator/expressions/decorator";
import { Identifier } from "../../../base-generator/expressions/common";
import {
  SimpleTypeExpression,
  TypeExpression,
} from "../../../base-generator/expressions/type";
import { Parameter } from "../../../base-generator/expressions/functions";
import { Block } from "../../../base-generator/expressions/statements";
import { GeneratorContext } from "../../../base-generator/types";
import { toStringOptions } from "../../types";
import { JsxElement } from "../jsx/element";
import { JsxOpeningElement, JsxClosingElement } from "../jsx/opening-element";

export function processFunctionTemplate(
  template: string,
  context: GeneratorContext,
  options?: toStringOptions
) {
  if (template.startsWith("<slot")) {
    return new JsxElement(
      new JsxOpeningElement(
        new Identifier("Fragment"),
        undefined,
        undefined,
        context
      ),
      [template],
      new JsxClosingElement(new Identifier("Fragment"), context)
    ).toString(options);
  }
  return template;
}

export class Function extends AngularFunction {
  constructor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier,
    typeParameters: any,
    parameters: Parameter[],
    type: TypeExpression | undefined,
    body: Block,
    context: GeneratorContext
  ) {
    super(
      decorators,
      modifiers,
      asteriskToken,
      name,
      typeParameters,
      parameters,
      new SimpleTypeExpression(""),
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
