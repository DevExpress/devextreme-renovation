import {
  Expression,
  Identifier,
  JsxOpeningElement as BaseJsxOpeningElement,
  ObjectLiteral,
  toStringOptions,
  PropertyAssignment,
  SpreadAssignment,
} from '@devextreme-generator/core';
import { Property } from '../class-members/property';

export class JsxOpeningElement extends BaseJsxOpeningElement {
  processTagName(tagName: Expression) {
    return tagName.toString() === 'Fragment'
      ? new Identifier('React.Fragment')
      : tagName;
  }

  toString(options?: toStringOptions) {
    const templateProperty = this.getTemplateProperty(options) as Property;
    if (!templateProperty) {
      return super.toString(options);
    }
    this.checkTemplatePropUsage(templateProperty);

    const contextElements = this.attributes.reduce(
      (elements: (PropertyAssignment | SpreadAssignment)[], a) => elements.concat(a.getTemplateContext()),
      [],
    );
    const templateParams = contextElements.length
      ? new ObjectLiteral(contextElements, false)
        .toString(options)
        .replace(/"/gi, "'")
      : '{}';

    return `${this.tagName.toString({
      ...options,
      variables: undefined,
    } as toStringOptions)}(${templateParams})`;
  }
}
