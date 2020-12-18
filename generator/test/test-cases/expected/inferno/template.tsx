import { WidgetWithProps, WidgetWithPropsInput } from "./dx-widget-with-props";

export declare type WidgetInputType = {
  someProp: boolean;
  headerTemplate: React.FunctionComponent<any>;
  template: React.FunctionComponent<
    Partial<{ textProp: string; textPropExpr: string }>
  >;
  contentTemplate: React.FunctionComponent<
    Partial<Omit<{ data: { p1: string }; index: number }, "data">> &
      Required<Pick<{ data: { p1: string }; index: number }, "data">>
  >;
  footerTemplate: React.FunctionComponent<Partial<{ someProp: boolean }>>;
  componentTemplate: React.FunctionComponent<
    Partial<Omit<typeof WidgetWithPropsInput, "value">> &
      Required<Pick<typeof WidgetWithPropsInput, "value">>
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
    Partial<Omit<{ data: { p1: string }; index: number }, "data">> &
      Required<Pick<{ data: { p1: string }; index: number }, "data">>
  >;
  contentComponent?: React.JSXElementConstructor<
    Partial<Omit<{ data: { p1: string }; index: number }, "data">> &
      Required<Pick<{ data: { p1: string }; index: number }, "data">>
  >;
  footerRender?: React.FunctionComponent<Partial<{ someProp: boolean }>>;
  footerComponent?: React.JSXElementConstructor<Partial<{ someProp: boolean }>>;
  componentRender?: React.FunctionComponent<
    Partial<Omit<typeof WidgetWithPropsInput, "value">> &
      Required<Pick<typeof WidgetWithPropsInput, "value">>
  >;
  componentComponent?: React.JSXElementConstructor<
    Partial<Omit<typeof WidgetWithPropsInput, "value">> &
      Required<Pick<typeof WidgetWithPropsInput, "value">>
  >;
};
export const WidgetInput: WidgetInputType = {
  someProp: false,
  headerTemplate: () => null,
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
  componentTemplate: WidgetWithProps,
};
import { Component as InfernoComponent } from "inferno";
import { createElement as h } from "inferno-create-element";
declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;

const getTemplate = (TemplateProp: any, RenderProp: any, ComponentProp: any) =>
  (TemplateProp &&
    (TemplateProp.defaultProps
      ? (props: any) => <TemplateProp {...props} />
      : TemplateProp)) ||
  (RenderProp &&
    ((props: any) =>
      RenderProp(
        ...("data" in props ? [props.data, props.index] : [props])
      ))) ||
  (ComponentProp && ((props: any) => <ComponentProp {...props} />));

export default class WidgetWithTemplate extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state = {};
  refs: any;
  constructor(props: typeof WidgetInput & RestProps) {
    super({
      ...WidgetInput,
      ...props,
    });
  }

  get restAttributes(): RestProps {
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
      render,
      someProp,
      template,
      ...restProps
    } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
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
      },
      restAttributes: this.restAttributes,
    } as WidgetWithTemplate);
  }
}
function view(viewModel: WidgetWithTemplate) {
  const myvar = viewModel.props.someProp;
  const FooterTemplate = viewModel.props.footerTemplate;
  const ComponentTemplate = viewModel.props.componentTemplate;
  return (
    <div>
      {viewModel.props.headerTemplate({})}

      {viewModel.props.contentTemplate &&
        viewModel.props.contentTemplate({ data: { p1: "value" }, index: 10 })}

      {!viewModel.props.contentTemplate &&
        viewModel.props.template({
          textProp: "textPropValue",
          textPropExpr: "textPropExrpValue",
        })}

      {viewModel.props.footerTemplate && FooterTemplate({ someProp: myvar })}

      {ComponentTemplate({ value: "Test Value" })}
    </div>
  );
}
