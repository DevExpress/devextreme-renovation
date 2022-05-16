import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { PublicWidgetWithProps } from './dx-public-widget-with-props';
import { WidgetWithProps, WidgetWithPropsInput } from './dx-widget-with-props';

interface WidgetInputType {
  someProp?: boolean;
  headerTemplate?: React.FunctionComponent<any>;
  template?: React.FunctionComponent<
    GetPropsType<{ textProp: string; textPropExpr: string }>
  >;
  contentTemplate?: React.FunctionComponent<
    GetPropsType<{ data: { p1: string }; index: number }>
  >;
  footerTemplate?: React.FunctionComponent<GetPropsType<{ someProp: boolean }>>;
  componentTemplate?: React.FunctionComponent<
    GetPropsType<typeof WidgetWithPropsInput>
  >;
  publicComponentTemplate?: React.FunctionComponent<
    GetPropsType<typeof WidgetWithPropsInput>
  >;
  headerRender?: React.FunctionComponent<any>;
  headerComponent?: React.JSXElementConstructor<any>;
  render?: React.FunctionComponent<
    GetPropsType<{ textProp: string; textPropExpr: string }>
  >;
  component?: React.JSXElementConstructor<
    GetPropsType<{ textProp: string; textPropExpr: string }>
  >;
  contentRender?: React.FunctionComponent<
    GetPropsType<{ data: { p1: string }; index: number }>
  >;
  contentComponent?: React.JSXElementConstructor<
    GetPropsType<{ data: { p1: string }; index: number }>
  >;
  footerRender?: React.FunctionComponent<GetPropsType<{ someProp: boolean }>>;
  footerComponent?: React.JSXElementConstructor<
    GetPropsType<{ someProp: boolean }>
  >;
  componentRender?: React.FunctionComponent<
    GetPropsType<typeof WidgetWithPropsInput>
  >;
  componentComponent?: React.JSXElementConstructor<
    GetPropsType<typeof WidgetWithPropsInput>
  >;
  publicComponentRender?: React.FunctionComponent<
    GetPropsType<typeof WidgetWithPropsInput>
  >;
  publicComponentComponent?: React.JSXElementConstructor<
    GetPropsType<typeof WidgetWithPropsInput>
  >;
}
export const WidgetInput = {
  someProp: false,
  headerTemplate: () => null,
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
  componentTemplate: WidgetWithProps,
  publicComponentTemplate: PublicWidgetWithProps,
} as Partial<WidgetInputType>;
import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<
    GetPropsType<typeof WidgetInput>,
    | 'headerRender'
    | 'headerComponent'
    | 'render'
    | 'component'
    | 'contentRender'
    | 'contentComponent'
    | 'footerRender'
    | 'footerComponent'
    | 'componentRender'
    | 'componentComponent'
    | 'publicComponentRender'
    | 'publicComponentComponent'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetInput>,
      | 'headerRender'
      | 'headerComponent'
      | 'render'
      | 'component'
      | 'contentRender'
      | 'contentComponent'
      | 'footerRender'
      | 'footerComponent'
      | 'componentRender'
      | 'componentComponent'
      | 'publicComponentRender'
      | 'publicComponentComponent'
    >
  >;
interface WidgetWithTemplate {
  props: WidgetInputModel & RestProps;
  restAttributes: RestProps;
}
export default function WidgetWithTemplate(
  inProps: typeof WidgetInput & RestProps
) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        component,
        componentComponent,
        componentRender,
        componentTemplate,
        contentComponent,
        contentRender,
        contentTemplate,
        footerComponent,
        footerRender,
        footerTemplate,
        headerComponent,
        headerRender,
        headerTemplate,
        publicComponentComponent,
        publicComponentRender,
        publicComponentTemplate,
        render,
        someProp,
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
      headerTemplate: getTemplate(
        props.headerTemplate,
        props.headerRender,
        props.headerComponent
      ),
      template: getTemplate(props.template, props.render, props.component),
      contentTemplate: getTemplate(
        props.contentTemplate,
        props.contentRender,
        props.contentComponent
      ),
      footerTemplate: getTemplate(
        props.footerTemplate,
        props.footerRender,
        props.footerComponent
      ),
      componentTemplate: getTemplate(
        props.componentTemplate,
        props.componentRender,
        props.componentComponent
      ),
      publicComponentTemplate: getTemplate(
        props.publicComponentTemplate,
        props.publicComponentRender,
        props.publicComponentComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}

function view(viewModel: WidgetWithTemplate) {
  const myvar = viewModel.props.someProp;
  const FooterTemplate = viewModel.props.footerTemplate;
  const ComponentTemplate = viewModel.props.componentTemplate;
  const PublicComponentTemplate = viewModel.props.publicComponentTemplate;
  return (
    <div>
      {viewModel.props.headerTemplate({})}

      {viewModel.props.contentTemplate &&
        viewModel.props.contentTemplate({ data: { p1: 'value' }, index: 10 })}

      {!viewModel.props.contentTemplate &&
        viewModel.props.template({
          textProp: 'textPropValue',
          textPropExpr: 'textPropExrpValue',
        })}

      {viewModel.props.footerTemplate && FooterTemplate({ someProp: myvar })}

      {ComponentTemplate({ value: 'Test Value' })}

      {PublicComponentTemplate({ value: 'Test Value' })}
    </div>
  );
}
