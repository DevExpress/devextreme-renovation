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
  const container1 = model.container.get ? model.container.get(0) : model.container;
  if (model.container) {
    childView.rootNodes.forEach((element) => {
      component.renderer.appendChild(container1, element);
    });
  }
};
export const hasTemplate = (name: any, props: any, component?: any): boolean => !!props[name];
