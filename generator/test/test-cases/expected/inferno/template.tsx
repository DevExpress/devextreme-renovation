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
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

const getTemplate = (TemplateProp: any) =>
  TemplateProp &&
  (TemplateProp.defaultProps
    ? (props: any) => <TemplateProp {...props} />
    : TemplateProp);

export default class WidgetWithTemplate extends InfernoComponent<
  typeof WidgetInput & RestProps
> {
  state = {};
  refs: any;

  constructor(props: typeof WidgetInput & RestProps) {
    super(props);
  }

  get restAttributes(): RestProps {
    const {
      componentTemplate,
      contentTemplate,
      footerTemplate,
      headerTemplate,
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
        headerTemplate: getTemplate(props.headerTemplate),
        template: getTemplate(props.template),
        contentTemplate: getTemplate(props.contentTemplate),
        footerTemplate: getTemplate(props.footerTemplate),
        componentTemplate: getTemplate(props.componentTemplate),
      },
      restAttributes: this.restAttributes,
    } as WidgetWithTemplate);
  }
}

WidgetWithTemplate.defaultProps = {
  ...WidgetInput,
};
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
