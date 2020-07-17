export declare type WidgetInputType = {
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
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
};

import React, { useCallback } from "react";
declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

function getTemplate(
  props: any,
  template: string,
  render: string,
  component: string
) {
  const getRender = (render: any) => (props: any) =>
    "data" in props ? render(props.data, props.index) : render(props);
  const Component = props[component];

  return (
    props[template] ||
    (props[render] && getRender(props[render])) ||
    (Component && ((props: any) => <Component {...props} />))
  );
}

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
        props,
        "headerTemplate",
        "headerRender",
        "headerComponent"
      ),
      template: getTemplate(props, "template", "render", "component"),
      contentTemplate: getTemplate(
        props,
        "contentTemplate",
        "contentRender",
        "contentComponent"
      ),
      footerTemplate: getTemplate(
        props,
        "footerTemplate",
        "footerRender",
        "footerComponent"
      ),
    },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};

function view(viewModel: Widget) {
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

      {viewModel.props.footerTemplate({ someProp: true })}
    </div>
  );
}
