import { AngularDirective, JsxAttribute, JsxOpeningElement } from '@devextreme-generator/angular';
import { Identifier, SimpleExpression } from '@devextreme-generator/core';
import { getUniqComponentName } from '../utils/uniq_name_generator';

export const tryToGetContent = (element: JsxOpeningElement): {
  content: string;
  elementDirective: AngularDirective | null;
} => {
  const componentName = element.tagName.toString();
  const isComponent = element.context.components?.[componentName];
  const { attributes } = element;
  let elementDirective = null;
  let content = '';

  if (!isComponent) {
    return { content, elementDirective };
  }

  const refAttr = attributes.find((attr) => (attr as JsxAttribute).toString()[0] === '#');
  let ref = refAttr?.toString().split('.').pop() as string;

  if (ref === '') {
    ref = getUniqComponentName(componentName);
    elementDirective = new AngularDirective(new Identifier(`#${ref}`), new SimpleExpression(''));
  }

  content = `<ng-content *ngTemplateOutlet="${ref}.widgetTemplate"></ng-content>`;
  return { content, elementDirective };
};
