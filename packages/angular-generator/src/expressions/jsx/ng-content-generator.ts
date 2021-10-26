import {
  Component,
  Identifier,
  JsxAttribute,
  JsxSpreadAttribute,
  SimpleExpression,
} from '@devextreme-generator/core';
import { AngularDirective } from './angular-directive';
import type { JsxOpeningElement } from './jsx-opening-element';
import { getUniqComponentName } from '../utils/uniq_name_generator';

export function tryToGetContent(element: JsxOpeningElement): {
  content: string;
  elementDirective: AngularDirective | null;
  condition: AngularDirective | null;
} {
  const componentName = element.tagName.toString();
  const isComponent = element.context.components?.[componentName];
  let elementDirective = null;
  let content = '';

  if (!isComponent || (isComponent as Component).isSVGComponent) {
    return { content, elementDirective, condition: null };
  }

  const refAttr = element.attributes.find((attr: JsxAttribute | JsxSpreadAttribute) => attr.toString()[0] === '#');
  let ref = refAttr?.toString().split('.').pop()?.replace('#', '');
  if (!ref) {
    ref = getUniqComponentName(componentName);
    elementDirective = new AngularDirective(new Identifier(`#${ref}`), new SimpleExpression(''));
  }
  const condition = element.attributes.find((d) => d.toString().indexOf('*ngIf') === 0) as AngularDirective;
  if (element.attributes.find((d) => d.toString().indexOf('*ngIf') === 0)) {
    element.attributes = element.attributes.filter((d) => d.toString().indexOf('*ngIf') !== 0);
  }

  content = `<ng-content *ngTemplateOutlet="${ref}?.widgetTemplate"></ng-content>`;
  return { content, elementDirective, condition };
}
