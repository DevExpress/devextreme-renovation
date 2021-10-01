function view(model: Widget) {
  return <div></div>;
}
function isMaterial() {
  return true;
}
function format(key: string) {
  return "localized_" + key;
}

export declare type BasePropsType = {
  empty?: string;
  height?: number;
  width?: number;
};
export const BaseProps: BasePropsType = {
  height: 10,
  get width() {
    return isMaterial() ? 20 : 10;
  },
};
export declare type TextsPropsType = {
  text?: string;
};
export const TextsProps: TextsPropsType = {
  get text() {
    return format("text");
  },
};
export declare type ExpressionPropsType = {
  expressionDefault?: any;
};
export const ExpressionProps: ExpressionPropsType = {
  get expressionDefault() {
    return isMaterial() ? 20 : 10;
  },
};
export declare type WidgetPropsType = typeof BaseProps & {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: React.FunctionComponent<Partial<void>>;
  __defaultNestedValues?: any;
  render?: React.FunctionComponent<Partial<void>>;
  component?: React.JSXElementConstructor<Partial<void>>;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseProps),
    Object.getOwnPropertyDescriptors({
      get text() {
        return format("text");
      },
      get texts1() {
        return { text: format("text") };
      },
      template: () => <div></div>,
      get __defaultNestedValues() {
        return { texts2: { text: format("text") }, texts3: TextsProps };
      },
    })
  )
);
export declare type WidgetPropsTypeType = {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  template?: React.FunctionComponent<Partial<void>>;
  empty?: string;
  height?: number;
  width?: number;
  children?: React.ReactNode;
  expressionDefault?: any;
  __defaultNestedValues?: any;
  render?: React.FunctionComponent<Partial<void>>;
  component?: React.JSXElementConstructor<Partial<void>>;
};
const WidgetPropsType: WidgetPropsTypeType = {
  text: WidgetProps.text,
  texts1: WidgetProps.texts1,
  template: WidgetProps.template,
  height: WidgetProps.height,
  width: WidgetProps.width,
  expressionDefault: ExpressionProps.expressionDefault,
  get __defaultNestedValues() {
    return { texts2: WidgetProps.texts2, texts3: WidgetProps.texts3 };
  },
};
import * as React from "react";
import { useCallback } from "react";
import { getTemplate } from "@devextreme/runtime/react";

function __collectChildren(children: React.ReactNode): Record<string, any> {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).reduce((acc: Record<string, any>, child) => {
    const {
      children: childChildren,
      __defaultNestedValues,
      ...childProps
    } = child.props;
    const collectedChildren = __collectChildren(childChildren);
    const childPropsValue = Object.keys(childProps).length
      ? childProps
      : __defaultNestedValues;
    const allChild = { ...childPropsValue, ...collectedChildren };
    return {
      ...acc,
      [child.type.propName]: acc[child.type.propName]
        ? [...acc[child.type.propName], allChild]
        : [allChild],
    };
  }, {});
}
export const Texts2: React.FunctionComponent<typeof TextsProps> & {
  propName: string;
} = () => null;
Texts2.propName = "texts2";
Texts2.defaultProps = TextsProps;

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetPropsType & RestProps;
  restAttributes: RestProps;
  nestedChildren: () => Record<string, any>;
  __getNestedTexts2: typeof TextsProps;
  __getNestedTexts3: typeof TextsProps;
}
export default function Widget(props: typeof WidgetPropsType & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        children,
        component,
        empty,
        expressionDefault,
        height,
        render,
        template,
        text,
        texts1,
        texts2,
        texts3,
        width,
        ...restProps
      } = {
        ...props,
        texts2: __getNestedTexts2(),
        texts3: __getNestedTexts3(),
      };
      return restProps;
    },
    [props]
  );
  const __nestedChildren = useCallback(
    function __nestedChildren(): Record<string, any> {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedTexts2 = useCallback(
    function __getNestedTexts2(): typeof TextsProps {
      const nested = __nestedChildren();
      return props.texts2
        ? props.texts2
        : nested.texts2
        ? nested.texts2?.[0]
        : props?.__defaultNestedValues?.texts2;
    },
    [props.texts2, props.children]
  );
  const __getNestedTexts3 = useCallback(
    function __getNestedTexts3(): typeof TextsProps {
      const nested = __nestedChildren();
      return props.texts3
        ? props.texts3
        : nested.texts3
        ? nested.texts3?.[0]
        : props?.__defaultNestedValues?.texts3;
    },
    [props.texts3, props.children]
  );

  return view({
    props: {
      ...props,
      template: getTemplate(props.template, props.render, props.component),
      texts2: __getNestedTexts2(),
      texts3: __getNestedTexts3(),
    },
    restAttributes: __restAttributes(),
    nestedChildren: __nestedChildren,
    __getNestedTexts2: __getNestedTexts2(),
    __getNestedTexts3: __getNestedTexts3(),
  });
}

Widget.defaultProps = WidgetPropsType;
