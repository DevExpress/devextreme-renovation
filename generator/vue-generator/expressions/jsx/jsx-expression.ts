import { JsxChildExpression as BaseJsxChildExpression } from "../../../angular-generator/expressions/jsx/jsx-child-expression";
import { JsxExpression as BaseJsxExpression } from "../../../angular-generator/expressions/jsx/jsx-expression";
import {
  Expression,
  SimpleExpression,
} from "../../../base-generator/expressions/base";
import { JsxAttribute } from "./attribute";
import {
  TemplateWrapperElement,
  ClosingTemplateWrapperElement,
} from "./template-wrapper";
import { toStringOptions } from "../../types";
import { Property } from "../class-members/property";
import { Call, Identifier } from "../../../base-generator/expressions/common";
import {
  getTemplate,
  BaseFunction,
} from "../../../base-generator/expressions/functions";
import { PropertyAccess } from "../../../base-generator/expressions/property-access";
import { VueDirective } from "./vue-directive";
import { isElement } from "../../../angular-generator/expressions/jsx/elements";
import { JsxElement } from "./element";
import { JsxSelfClosingElement } from "./opening-element";
import { getJsxExpression } from "../../../base-generator/expressions/jsx";

export class JsxExpression extends BaseJsxExpression {}

export class JsxChildExpression extends BaseJsxChildExpression {
  createJsxExpression(statement: Expression) {
    return new JsxExpression(undefined, statement);
  }

  createContainer(
    attributes: JsxAttribute[],
    children: Array<JsxExpression | JsxElement | JsxSelfClosingElement>
  ) {
    return new JsxElement(
      new TemplateWrapperElement(attributes),
      children,
      new ClosingTemplateWrapperElement()
    );
  }

  createIfAttribute(condition?: Expression) {
    return new VueDirective(
      new Identifier(condition ? "v-if" : "v-else"),
      condition || new SimpleExpression("")
    );
  }

  getExpressionFromStatement(statement: Expression, options?: toStringOptions) {
    return getJsxExpression(statement, options);
  }

  getTemplateForVariable(
    element: JsxElement | JsxSelfClosingElement
  ): JsxElement | JsxSelfClosingElement {
    return element;
  }

  processSlotInConditional() {
    return undefined;
  }

  compileConditionStatement(
    condition: Expression,
    thenStatement: Expression,
    elseStatement: Expression,
    options?: toStringOptions
  ) {
    const result: string[] = [];
    result.push(this.compileStatement(thenStatement, condition, options));
    result.push(this.compileStatement(elseStatement, undefined, options));

    return result.join("\n");
  }

  compileSlot(slot: Property) {
    if (slot.name.toString() === "children") {
      return `<slot></slot>`;
    }
    return `<slot name="${slot.name}"></slot>`;
  }

  compileIterator(
    iterator: BaseFunction,
    expression: Call,
    options?: toStringOptions
  ): string {
    const templateOptions = options
      ? { ...options, ...{ keys: [] } }
      : { members: [], hasStyle: false };
    const templateExpression = getTemplate(iterator, templateOptions, true);
    const itemsExpression = (expression.expression as PropertyAccess)
      .expression;
    const vForValue = [iterator.parameters[0].name.toString()];

    if (iterator.parameters[1]) {
      vForValue.push(iterator.parameters[1].toString());
    }

    const vForAttribute = new VueDirective(
      new Identifier("v-for"),
      new SimpleExpression(
        `${
          vForValue.length > 1 ? `(${vForValue})` : vForValue[0].toString()
        } of ${itemsExpression.toString(options)}`
      )
    );

    if (isElement(templateExpression)) {
      const element = templateExpression.clone();
      const elementString = `<template ${vForAttribute}>${element.toString(
        templateOptions
      )}</template>`;
      if (options) {
        options.hasStyle = options.hasStyle || templateOptions.hasStyle;
      }
      return elementString;
    }

    if (templateExpression) {
      const expression: JsxChildExpression = new JsxChildExpression(
        templateExpression as JsxExpression
      );
      return this.createContainer(
        [vForAttribute as JsxAttribute],
        [expression]
      ).toString(templateOptions);
    }

    return "";
  }
}
