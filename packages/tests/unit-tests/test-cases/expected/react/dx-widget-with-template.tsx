import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import InnerWidget, { InnerWidgetProps } from './dependency-props';

interface WidgetWithTemplateInputType {
  template?: any;
  componentTemplate?: React.FunctionComponent<
    GetPropsType<typeof InnerWidgetProps>
  >;
  arrowTemplate?: any;
  render?: any;
  component?: any;
  componentRender?: React.FunctionComponent<
    GetPropsType<typeof InnerWidgetProps>
  >;
  componentComponent?: React.JSXElementConstructor<
    GetPropsType<typeof InnerWidgetProps>
  >;
  arrowRender?: any;
  arrowComponent?: any;
}
export const WidgetWithTemplateInput = {
  componentTemplate: InnerWidget,
} as Partial<WidgetWithTemplateInputType>;
import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetWithTemplateInputModel = Required<
  Omit<
    GetPropsType<typeof WidgetWithTemplateInput>,
    | 'template'
    | 'arrowTemplate'
    | 'render'
    | 'component'
    | 'componentRender'
    | 'componentComponent'
    | 'arrowRender'
    | 'arrowComponent'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetWithTemplateInput>,
      | 'template'
      | 'arrowTemplate'
      | 'render'
      | 'component'
      | 'componentRender'
      | 'componentComponent'
      | 'arrowRender'
      | 'arrowComponent'
    >
  >;
interface WidgetWithTemplate {
  props: WidgetWithTemplateInputModel & RestProps;
  restAttributes: RestProps;
}
export default function WidgetWithTemplate(
  inProps: typeof WidgetWithTemplateInput & RestProps
) {
  const props = combineWithDefaultProps<WidgetWithTemplateInputModel>(
    WidgetWithTemplateInput,
    inProps
  );

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
      return restProps as RestProps;
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

function view(viewModel: WidgetWithTemplate) {
  return (
    <div>
      {viewModel.props.componentTemplate({ required: true })}

      {viewModel.props.template({})}

      {viewModel.props.arrowTemplate({})}
    </div>
  );
}
