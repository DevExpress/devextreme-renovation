import {
  Identifier,
  JsxAttribute,
  JsxSpreadAttribute,
  SimpleExpression,
} from '@devextreme-generator/core';
import { AngularDirective } from './angular-directive';
import type { JsxOpeningElement } from './jsx-opening-element';
import { getUniqComponentName } from '../utils/uniq_name_generator';
import { AngularComponent } from '../component';

function isStructDirective(d: JsxAttribute | JsxSpreadAttribute): boolean {
  return d.toString().indexOf('*ngIf') === 0
    || d.toString().indexOf('*ngFor') === 0
    || d.toString().indexOf('*ngSwitch') === 0;
}

export function tryToGetContent(element: JsxOpeningElement): {
  content: string;
  elementDirectives: AngularDirective[];
  condition: AngularDirective | null;
} {
  const componentName = element.tagName.toString();
  const component = element.context.components?.[componentName] as AngularComponent;
  const elementDirectives: Array<AngularDirective> = [];

  if (!component || !component.decorator.isWrappedByTemplate) {
    return { content: '', elementDirectives, condition: null };
  }
  const refAttr = element.attributes.find((attr: JsxAttribute | JsxSpreadAttribute) => attr.toString()[0] === '#');
  const existRef = refAttr?.toString().split('.').pop()?.replace('#', '');
  const ref = existRef || getUniqComponentName(componentName);
  if (!existRef) {
    elementDirectives.push(new AngularDirective(new Identifier(`#${ref}`), new SimpleExpression('')));
  }
  elementDirectives.push(new AngularDirective(new Identifier('style'), new SimpleExpression('display: contents')));
  const condition = element.attributes.find(isStructDirective) as AngularDirective;
  if (element.attributes.find(isStructDirective)) {
    element.attributes = element.attributes.filter((d) => !isStructDirective(d));
  }

  const content = component.getContentTemplateOutlet(ref);
  return { content, elementDirectives, condition };
}
