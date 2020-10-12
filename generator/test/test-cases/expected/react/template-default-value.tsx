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
    {model.props.compTemplate({ value: model.props.stringToRender })}
  </div>
);

export declare type TemplateDefaultValuePropsType = {
  contentTemplate: (props: { data: { p1: string }; index: number }) => any;
  stringToRender: string;
  compTemplate: React.FunctionComponent<Partial<{ value: string }>>;
  contentRender?: (props: { data: { p1: string }; index: number }) => any;
  contentComponent?: (props: { data: { p1: string }; index: number }) => any;
  compRender?: React.FunctionComponent<Partial<{ value: string }>>;
  compComponent?: React.JSXElementConstructor<Partial<{ value: string }>>;
};
export const TemplateDefaultValueProps: TemplateDefaultValuePropsType = {
  contentTemplate: (props) => <span>{props.data.p1}</span>,
  stringToRender: "default string",
  compTemplate: WidgetWithProps,
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
        compComponent,
        compRender,
        compTemplate,
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
      compTemplate: getTemplate(
        props.compTemplate,
        props.compRender,
        props.compComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}

TemplateDefaultValue.defaultProps = {
  ...TemplateDefaultValueProps,
};
