export const renderTemplate = (template: any, model: any, component?: any): void => {
  template(model, model.container);
};
export const hasTemplate = (name: any, props: any, component?: any): boolean => !!props[name];
