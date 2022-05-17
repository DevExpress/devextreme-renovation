import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import WidgetWithTemplate from './dx-widget-with-template';

interface TemplateTransitWidgetInputType {
  templateProp?: any;
  componentTemplateProp?: any;
  renderProp?: any;
  componentProp?: any;
  componentRenderProp?: any;
  componentComponentProp?: any;
}
export const TemplateTransitWidgetInput =
  {} as Partial<TemplateTransitWidgetInputType>;
import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type TemplateTransitWidgetInputModel = Required<
  Omit<
    GetPropsType<typeof TemplateTransitWidgetInput>,
    | 'templateProp'
    | 'componentTemplateProp'
    | 'renderProp'
    | 'componentProp'
    | 'componentRenderProp'
    | 'componentComponentProp'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof TemplateTransitWidgetInput>,
      | 'templateProp'
      | 'componentTemplateProp'
      | 'renderProp'
      | 'componentProp'
      | 'componentRenderProp'
      | 'componentComponentProp'
    >
  >;
interface TemplateTransitWidget {
  props: TemplateTransitWidgetInputModel & RestProps;
  restAttributes: RestProps;
}
export default function TemplateTransitWidget(
  inProps: typeof TemplateTransitWidgetInput & RestProps
) {
  const props = combineWithDefaultProps<TemplateTransitWidgetInputModel>(
    TemplateTransitWidgetInput,
    inProps
  );

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
      return restProps as RestProps;
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
