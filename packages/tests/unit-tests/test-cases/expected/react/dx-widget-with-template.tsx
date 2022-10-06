export type WidgetWithTemplateInputType = {
  template?: any;
  componentTemplate?: any;
  arrowTemplate?: any;
  render?: any;
  component?: any;
  componentRender?: any;
  componentComponent?: any;
  arrowRender?: any;
  arrowComponent?: any;
};
export const WidgetWithTemplateInput: WidgetWithTemplateInputType = {};
import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};
interface WidgetWithTemplate {
  props: typeof WidgetWithTemplateInput & RestProps;
  restAttributes: RestProps;
}

export default function WidgetWithTemplate(
  props: typeof WidgetWithTemplateInput & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        arrowComponent,
        arrowRender,
        arrowTemplate,
        component,
        componentComponent,
        componentRender,
        componentTemplate,
        render,
        template,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: {
      ...props,
      template: getTemplate(props.template, props.render, props.component),
      componentTemplate: getTemplate(
        props.componentTemplate,
        props.componentRender,
        props.componentComponent
      ),
      arrowTemplate: getTemplate(
        props.arrowTemplate,
        props.arrowRender,
        props.arrowComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}

WidgetWithTemplate.defaultProps = WidgetWithTemplateInput;
function view(viewModel: WidgetWithTemplate) {
  return (
    <div>
      {viewModel.props.componentTemplate({})}

      {viewModel.props.template({})}

      {viewModel.props.arrowTemplate({})}
    </div>
  );
}
