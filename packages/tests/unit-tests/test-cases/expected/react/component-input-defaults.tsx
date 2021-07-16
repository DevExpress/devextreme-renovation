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
import * as React from "react";
import { useCallback } from "react";

function __collectChildren<T>(children: React.ReactNode): T[] {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).map((child) => {
    const { children: childChildren, ...childProps } = child.props;
    const collectedChildren = {} as any;
    __collectChildren(childChildren).forEach(
      ({ __name, ...restProps }: any) => {
        if (__name) {
          if (!collectedChildren[__name]) {
            collectedChildren[__name] = [];
          }
          collectedChildren[__name].push(restProps);
        }
      }
    );
    return {
      ...collectedChildren,
      ...childProps,
      __name: child.type.propName,
    };
  });
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
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
  nestedChildren: <T>() => T[];
  __getNestedTexts2: typeof TextsProps;
  __getNestedTexts3: typeof TextsProps;
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

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        children,
        component,
        empty,
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
    function __nestedChildren<T>(): T[] {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedTexts2 = useCallback(
    function __getNestedTexts2(): typeof TextsProps {
      const nested = __nestedChildren<typeof TextsProps & { __name: string }>()
        .filter((child) => child.__name === "texts2")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return (n as any)?.__defaultNestedValues || n;
          }
          return n;
        });
      return props.texts2
        ? props.texts2
        : nested.length
        ? nested?.[0]
        : props?.__defaultNestedValues?.texts2;
    },
    [props.texts2, props.children]
  );
  const __getNestedTexts3 = useCallback(
    function __getNestedTexts3(): typeof TextsProps {
      const nested = __nestedChildren<typeof TextsProps & { __name: string }>()
        .filter((child) => child.__name === "texts3")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return (n as any)?.__defaultNestedValues || n;
          }
          return n;
        });
      return props.texts3
        ? props.texts3
        : nested.length
        ? nested?.[0]
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

Widget.defaultProps = WidgetProps;
