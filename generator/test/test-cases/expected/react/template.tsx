export declare type WidgetInputType = {
  someProp: boolean;
  headerTemplate?: any;
  template: (props: { textProp: string; textPropExpr: string }) => any;
  contentTemplate: (props: { data: { p1: string }; index: number }) => any;
  footerTemplate: (props: { someProp: boolean }) => any;
  headerRender?: any;
  headerComponent?: any;
  render?: any;
  component?: any;
  contentRender?: any;
  contentComponent?: any;
  footerRender?: any;
  footerComponent?: any;
};
export const WidgetInput: WidgetInputType = {
  someProp: false,
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

const getTemplate = (TemplateProp: any, RenderProp: any, ComponentProp: any) =>
  (TemplateProp &&
    ((props: any) =>
      TemplateProp({ ...TemplateProp.defaultProps, ...props }))) ||
  (RenderProp &&
    ((props: any) =>
      RenderProp(
        ...("data" in props ? [props.data, props.index] : [props])
      ))) ||
  (ComponentProp && ((props: any) => <ComponentProp {...props} />));

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        component,
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
    },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
function view(viewModel: Widget) {
  const myvar = viewModel.props.someProp;
  const FooterTemplate = viewModel.props.footerTemplate;
  return (
    <div>
      {viewModel.props.headerTemplate()}

      {viewModel.props.contentTemplate &&
        viewModel.props.contentTemplate({ data: { p1: "value" }, index: 10 })}

      {!viewModel.props.contentTemplate &&
        viewModel.props.template({
          textProp: "textPropValue",
          textPropExpr: "textPropExrpValue",
        })}

      {FooterTemplate({ someProp: myvar })}
    </div>
  );
}
