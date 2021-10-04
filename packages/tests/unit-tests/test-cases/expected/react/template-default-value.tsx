import { WidgetWithProps } from "./dx-widget-with-props";
export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    TemplateDefaultValue
    {model.props.defaultCompTemplate({
      optionalValue: model.props.stringToRender,
      value: "twdComp",
    })}
    {model.props.defaultCompTemplate({ value: model.props.stringToRender })}
    {model.props.defaultFuncTemplate({ value: model.props.stringToRender })}
  </div>
);

export declare type TemplateDefaultValuePropsType = {
  defaultCompTemplate: React.FunctionComponent<
    Partial<
      Omit<{ optionalValue?: string | undefined; value: string }, "value">
    > &
      Required<
        Pick<{ optionalValue?: string | undefined; value: string }, "value">
      >
  >;
  defaultFuncTemplate: React.FunctionComponent<
    Partial<
      Omit<{ optionalValue?: string | undefined; value: string }, "value">
    > &
      Required<
        Pick<{ optionalValue?: string | undefined; value: string }, "value">
      >
  >;
  stringToRender: string;
  defaultCompRender?: React.FunctionComponent<
    Partial<
      Omit<{ optionalValue?: string | undefined; value: string }, "value">
    > &
      Required<
        Pick<{ optionalValue?: string | undefined; value: string }, "value">
      >
  >;
  defaultCompComponent?: React.JSXElementConstructor<
    Partial<
      Omit<{ optionalValue?: string | undefined; value: string }, "value">
    > &
      Required<
        Pick<{ optionalValue?: string | undefined; value: string }, "value">
      >
  >;
  defaultFuncRender?: React.FunctionComponent<
    Partial<
      Omit<{ optionalValue?: string | undefined; value: string }, "value">
    > &
      Required<
        Pick<{ optionalValue?: string | undefined; value: string }, "value">
      >
  >;
  defaultFuncComponent?: React.JSXElementConstructor<
    Partial<
      Omit<{ optionalValue?: string | undefined; value: string }, "value">
    > &
      Required<
        Pick<{ optionalValue?: string | undefined; value: string }, "value">
      >
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
import { useCallback } from "react";
import { getTemplate } from "@devextreme/runtime/react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface TemplateDefaultValue {
  props: typeof TemplateDefaultValueProps & RestProps;
  restAttributes: RestProps;
}
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

TemplateDefaultValue.defaultProps = TemplateDefaultValueProps;
