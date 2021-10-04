import { ViewContainerRef } from '@angular/core';

export const renderTemplate = (
  template: any,
  model: any,
  component?: any,
): void => {
  const childView = (component.viewContainerRef as ViewContainerRef).createEmbeddedView(template, {
    $implicit: model.item,
    index: model.index,
  });
  const container = model.container.get ? model.container.get(0) : model.container;
  if (container) {
    childView.rootNodes.forEach((element) => {
      component.renderer.appendChild(container, element);
    });
  }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hasTemplate = (name: any, props: any, _component?: any): boolean => !!props[name];
