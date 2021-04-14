import { SimpleExpression } from '@devextreme-generator/core';
import { JsxOpeningElement, JsxClosingElement } from './opening-element';
import { JsxAttribute } from './attribute';
import { toStringOptions } from '../../types';
import { JsxSpreadAttribute } from './spread-attribute';

export class TemplateWrapperElement extends JsxOpeningElement {
  getTemplateProperty(_options?: toStringOptions) {
    return undefined;
  }

  constructor(attributes: Array<JsxAttribute | JsxSpreadAttribute>) {
    super(new SimpleExpression('template'), undefined, attributes, {});
  }
}

export class ClosingTemplateWrapperElement extends JsxClosingElement {
  constructor() {
    super(new SimpleExpression('template'), {});
  }
}
