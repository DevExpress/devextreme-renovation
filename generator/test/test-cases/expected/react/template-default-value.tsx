import { WidgetWithProps } from "./dx-widget-with-props";
export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    {" "}
    TemplateDefaultValue
    {model.props.contentTemplate({
      data: { p1: model.props.stringToRender },
      index: 5,
    })}
    ComponentTemplateDefaultValue
    {model.props.componentTemplate({ value: model.props.stringToRender })}
  </div>
);

export declare type TemplateDefaultValuePropsType = {
  contentTemplate: (props: { data: { p1: string }; index: number }) => any;
  stringToRender: string;
  componentTemplate: React.FunctionComponent<Partial<{ value: string }>>;
  contentRender?: (props: { data: { p1: string }; index: number }) => any;
  contentComponent?: (props: { data: { p1: string }; index: number }) => any;
  componentRender?: React.FunctionComponent<Partial<{ value: string }>>;
  componentComponent?: React.JSXElementConstructor<Partial<{ value: string }>>;
};
export const TemplateDefaultValueProps: TemplateDefaultValuePropsType = {
  contentTemplate: (props) => <span>{props.data.p1}</span>,
  stringToRender: "default string",
  componentTemplate: WidgetWithProps,
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof TemplateDefaultValueProps
>;
interface TemplateDefaultValue {
  props: typeof TemplateDefaultValueProps & RestProps;
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

export default function TemplateDefaultValue(
  props: typeof TemplateDefaultValueProps & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        componentComponent,
        componentRender,
        componentTemplate,
        contentComponent,
        contentRender,
        contentTemplate,
        stringToRender,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return viewFunction({
    props: {
      ...props,
      contentTemplate: getTemplate(
        props.contentTemplate,
        props.contentRender,
        props.contentComponent
      ),
      componentTemplate: getTemplate(
        props.componentTemplate,
        props.componentRender,
        props.componentComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}

TemplateDefaultValue.defaultProps = {
  ...TemplateDefaultValueProps,
};
