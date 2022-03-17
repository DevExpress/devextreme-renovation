import WidgetWithTemplate from './dx-widget-with-template';

export type TemplateTransitWidgetInputType = {
  templateProp?: any;
  componentTemplateProp?: any;
  renderProp?: any;
  componentProp?: any;
  componentRenderProp?: any;
  componentComponentProp?: any;
};
export const TemplateTransitWidgetInput: TemplateTransitWidgetInputType = {};
import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface TemplateTransitWidget {
  props: typeof TemplateTransitWidgetInput & RestProps;
  restAttributes: RestProps;
}

export default function TemplateTransitWidget(
  props: typeof TemplateTransitWidgetInput & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        componentComponentProp,
        componentProp,
        componentRenderProp,
        componentTemplateProp,
        renderProp,
        templateProp,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return view_1({
    props: {
      ...props,
      templateProp: getTemplate(
        props.templateProp,
        props.renderProp,
        props.componentProp
      ),
      componentTemplateProp: getTemplate(
        props.componentTemplateProp,
        props.componentRenderProp,
        props.componentComponentProp
      ),
    },
    restAttributes: __restAttributes(),
  });
}

TemplateTransitWidget.defaultProps = TemplateTransitWidgetInput;
function view_1({
  props: { componentTemplateProp: ComponentTemplateProp, templateProp },
}: TemplateTransitWidget) {
  return (
    <WidgetWithTemplate
      template={templateProp}
      componentTemplate={ComponentTemplateProp}
    />
  );
}
function view_2(viewModel: TemplateTransitWidget) {
  const { templateProp: TemplateProp } = viewModel.props;
  const ComponentTemplateProp = viewModel.props.componentTemplateProp;
  return (
    <WidgetWithTemplate
      template={TemplateProp}
      componentTemplate={ComponentTemplateProp}
    />
  );
}
function view_3(viewModel: TemplateTransitWidget) {
  return (
    <WidgetWithTemplate
      template={viewModel.props.templateProp}
      componentTemplate={viewModel.props.componentTemplateProp}
    />
  );
}
