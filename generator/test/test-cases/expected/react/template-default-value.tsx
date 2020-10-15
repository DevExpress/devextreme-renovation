import { WidgetWithProps } from "./dx-widget-with-props";
export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    {" "}
    TemplateDefaultValue
    {model.props.contentTemplate({
      value: model.props.stringToRender,
      number: 21,
    })}
    {model.props.contentTemplate({ value: "" })}
    {model.props.contentTemplate({
      value: "",
      optionalValue: "optional" + model.props.stringToRender,
    })}
  </div>
);

export declare type TemplateDefaultValuePropsType = {
  contentTemplate: React.FunctionComponent<
    Partial<
      Omit<{ value: string; optionalValue?: string; number: number }, "value">
    > &
      Required<
        Pick<{ value: string; optionalValue?: string; number: number }, "value">
      >
  >;
  stringToRender: string;
  contentRender?: React.FunctionComponent<
    Partial<
      Omit<{ value: string; optionalValue?: string; number: number }, "value">
    > &
      Required<
        Pick<{ value: string; optionalValue?: string; number: number }, "value">
      >
  >;
  contentComponent?: React.JSXElementConstructor<
    Partial<
      Omit<{ value: string; optionalValue?: string; number: number }, "value">
    > &
      Required<
        Pick<{ value: string; optionalValue?: string; number: number }, "value">
      >
  >;
};
export const TemplateDefaultValueProps: TemplateDefaultValuePropsType = {
  contentTemplate: WidgetWithProps,
  stringToRender: "default string",
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
    (TemplateProp.defaultProps
      ? (props: any) => <TemplateProp {...props} />
      : TemplateProp)) ||
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
    },
    restAttributes: __restAttributes(),
  });
}

TemplateDefaultValue.defaultProps = {
  ...TemplateDefaultValueProps,
};
