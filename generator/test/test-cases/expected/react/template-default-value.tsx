import SampleWidget from "./sample-widget";
export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    {" "}
    TemplateDefaultValue
    {model.props.contentTemplate({})}
    {model.props.contentTemplate({ text: model.props.stringToRender })}
    {model.props.contentTemplate({
      textWithDefault: model.props.stringToRender,
    })}
  </div>
);

export declare type TemplateDefaultValuePropsType = {
  contentTemplate: React.FunctionComponent<
    Partial<{ text?: string; textWithDefault?: string; number?: number }>
  >;
  stringToRender: string;
  contentRender?: React.FunctionComponent<
    Partial<{ text?: string; textWithDefault?: string; number?: number }>
  >;
  contentComponent?: React.JSXElementConstructor<
    Partial<{ text?: string; textWithDefault?: string; number?: number }>
  >;
};
export const TemplateDefaultValueProps: TemplateDefaultValuePropsType = {
  contentTemplate: SampleWidget,
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
