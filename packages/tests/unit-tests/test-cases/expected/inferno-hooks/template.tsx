import { PublicWidgetWithProps } from './dx-public-widget-with-props';
import { WidgetWithProps, WidgetWithPropsInput } from './dx-widget-with-props';

export type WidgetInputType = {
  someProp: boolean;
  headerTemplate: React.FunctionComponent<any>;
  template: React.FunctionComponent<
    Partial<{ textProp: string; textPropExpr: string }>
  >;
  contentTemplate: React.FunctionComponent<
    Partial<Omit<{ data: { p1: string }; index: number }, 'data'>> &
      Required<Pick<{ data: { p1: string }; index: number }, 'data'>>
  >;
  footerTemplate: React.FunctionComponent<Partial<{ someProp: boolean }>>;
  componentTemplate: React.FunctionComponent<
    Partial<Omit<typeof WidgetWithPropsInput, 'value'>> &
      Required<Pick<typeof WidgetWithPropsInput, 'value'>>
  >;
  publicComponentTemplate: React.FunctionComponent<
    Partial<Omit<typeof WidgetWithPropsInput, 'value'>> &
      Required<Pick<typeof WidgetWithPropsInput, 'value'>>
  >;
  headerRender?: React.FunctionComponent<any>;
  headerComponent?: React.JSXElementConstructor<any>;
  render?: React.FunctionComponent<
    Partial<{ textProp: string; textPropExpr: string }>
  >;
  component?: React.JSXElementConstructor<
    Partial<{ textProp: string; textPropExpr: string }>
  >;
  contentRender?: React.FunctionComponent<
    Partial<Omit<{ data: { p1: string }; index: number }, 'data'>> &
      Required<Pick<{ data: { p1: string }; index: number }, 'data'>>
  >;
  contentComponent?: React.JSXElementConstructor<
    Partial<Omit<{ data: { p1: string }; index: number }, 'data'>> &
      Required<Pick<{ data: { p1: string }; index: number }, 'data'>>
  >;
  footerRender?: React.FunctionComponent<Partial<{ someProp: boolean }>>;
  footerComponent?: React.JSXElementConstructor<Partial<{ someProp: boolean }>>;
  componentRender?: React.FunctionComponent<
    Partial<Omit<typeof WidgetWithPropsInput, 'value'>> &
      Required<Pick<typeof WidgetWithPropsInput, 'value'>>
  >;
  componentComponent?: React.JSXElementConstructor<
    Partial<Omit<typeof WidgetWithPropsInput, 'value'>> &
      Required<Pick<typeof WidgetWithPropsInput, 'value'>>
  >;
  publicComponentRender?: React.FunctionComponent<
    Partial<Omit<typeof WidgetWithPropsInput, 'value'>> &
      Required<Pick<typeof WidgetWithPropsInput, 'value'>>
  >;
  publicComponentComponent?: React.JSXElementConstructor<
    Partial<Omit<typeof WidgetWithPropsInput, 'value'>> &
      Required<Pick<typeof WidgetWithPropsInput, 'value'>>
  >;
};
export const WidgetInput: WidgetInputType = {
  someProp: false,
  headerTemplate: () => null,
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
  componentTemplate: WidgetWithProps,
  publicComponentTemplate: PublicWidgetWithProps,
};
import { useCallback, HookComponent } from '@devextreme/runtime/inferno-hooks';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithTemplate {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export function WidgetWithTemplate(props: typeof WidgetInput & RestProps) {
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
      return restProps;
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

WidgetWithTemplate.defaultProps = WidgetInput;

function HooksWidgetWithTemplate(props: typeof WidgetInput & RestProps) {
  return (
    <HookComponent
      renderFn={WidgetWithTemplate}
      renderProps={props}
    ></HookComponent>
  );
}
export default HooksWidgetWithTemplate;
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
