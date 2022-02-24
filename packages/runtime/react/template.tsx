import ReactDOM from 'react-dom';
import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderTemplate = (template: any, model: any, _component?: any): void => {
  template(model, model.container);
};
export const hasTemplate = (
  name: string,
  props: Record<string, unknown>,
  _component?: any,
): boolean => {
  const value = props[name];
  return !!value && typeof value !== 'string';
};
export const getWrapperTemplate = (TemplateProp: any) => {
  const isComponent = typeof TemplateProp === 'string' || !!(TemplateProp instanceof Element);

  return isComponent ? TemplateProp : (data: any) => {
    const container = data.container ? data.container : data.item;
    ReactDOM.render(
    /* eslint-disable react/jsx-props-no-spreading */
      <TemplateProp {...data} /> as React.ReactElement,
      container,
    );
  };
};

export const getTemplate = (TemplateProp: any, RenderProp: any, ComponentProp: any): any => {
  if (TemplateProp) {
    return TemplateProp.defaultProps ? (props: any) => <TemplateProp {...props} /> : TemplateProp;
  } if (RenderProp) {
    return (props: any) => RenderProp(
      ...('data' in props ? [props.data, props.index] : [props]),
    );
  } if (ComponentProp) {
    return (props: any) => <ComponentProp {...props} />;
  }
  return '';
};
