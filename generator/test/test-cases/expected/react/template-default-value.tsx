import { WidgetWithProps } from "./dx-widget-with-props";
export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    {" "}
    TemplateDefaultValue
    {model.props.defaultCompTemplate({
      optionalValue: model.props.stringToRender,
      value: "twdComp",
    })}
    {model.props.defaultCompTemplate({
      optionalValue: model.props.stringToRender,
    })}
    {model.props.defaultFuncTemplate({
      optionalValue: model.props.stringToRender,
    })}
  </div>
);

export declare type TemplateDefaultValuePropsType = {
  defaultCompTemplate: React.FunctionComponent<
    Partial<{ optionalValue?: string; value: string }>
  >;
  defaultFuncTemplate: React.FunctionComponent<
    Partial<{ optionalValue?: string; value: string }>
  >;
  stringToRender: string;
  defaultCompRender?: React.FunctionComponent<
    Partial<{ optionalValue?: string; value: string }>
  >;
  defaultCompComponent?: React.JSXElementConstructor<
    Partial<{ optionalValue?: string; value: string }>
  >;
  defaultFuncRender?: React.FunctionComponent<
    Partial<{ optionalValue?: string; value: string }>
  >;
  defaultFuncComponent?: React.JSXElementConstructor<
    Partial<{ optionalValue?: string; value: string }>
  >;
};
export const TemplateDefaultValueProps: TemplateDefaultValuePropsType = {
  defaultCompTemplate: WidgetWithProps,
  defaultFuncTemplate: (props) => (
    <div>
      !DefaultFunc:
      {props.value || "ftwdCompDefault"}
      {props.optionalValue}
    </div>
  ),
  stringToRender: "strCompDefault",
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
        defaultCompComponent,
        defaultCompRender,
        defaultCompTemplate,
        defaultFuncComponent,
        defaultFuncRender,
        defaultFuncTemplate,
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
      defaultCompTemplate: getTemplate(
        props.defaultCompTemplate,
        props.defaultCompRender,
        props.defaultCompComponent
      ),
      defaultFuncTemplate: getTemplate(
        props.defaultFuncTemplate,
        props.defaultFuncRender,
        props.defaultFuncComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}

TemplateDefaultValue.defaultProps = {
  ...TemplateDefaultValueProps,
};
