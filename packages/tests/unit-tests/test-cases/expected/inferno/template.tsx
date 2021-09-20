import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
import { WidgetWithProps, WidgetWithPropsInput } from "./dx-widget-with-props";

export declare type WidgetInputType = {
  someProp: boolean;
  headerTemplate: any;
  template: any;
  contentTemplate: any;
  footerTemplate: any;
  componentTemplate: any;
};
export const WidgetInput: WidgetInputType = {
  someProp: false,
  headerTemplate: () => null,
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
  componentTemplate: WidgetWithProps,
};
import { createElement as h } from "inferno-compat";
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
export default class WidgetWithTemplate extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
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
    } = this.props as any;
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

WidgetWithTemplate.defaultProps = WidgetInput;
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
