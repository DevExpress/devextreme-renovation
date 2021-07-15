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
  __defaultNestedValues?: any;
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
      get __defaultNestedValues() {
        return { texts1: { text: format("text") }, texts2: TextsProps };
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
export const Texts1: React.FunctionComponent<typeof TextsProps> & {
  propName: string;
} = () => null;
Texts1.propName = "texts1";
Texts1.defaultProps = TextsProps;

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
  __getNestedTexts1: typeof TextsProps;
  __getNestedTexts2: typeof TextsProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        children,
        empty,
        height,
        text,
        texts1,
        texts2,
        width,
        ...restProps
      } = {
        ...props,
        texts1: __getNestedTexts1(),
        texts2: __getNestedTexts2(),
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
  const __getNestedTexts1 = useCallback(
    function __getNestedTexts1(): typeof TextsProps {
      const nested = __nestedChildren<typeof TextsProps & { __name: string }>()
        .filter((child) => child.__name === "texts1")
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
      return props.texts1
        ? props.texts1
        : nested.length
        ? nested?.[0]
        : props?.__defaultNestedValues?.texts1;
    },
    [props.texts1, props.children]
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

  return view({
    props: {
      ...props,
      texts1: __getNestedTexts1(),
      texts2: __getNestedTexts2(),
    },
    restAttributes: __restAttributes(),
    nestedChildren: __nestedChildren,
    __getNestedTexts1: __getNestedTexts1(),
    __getNestedTexts2: __getNestedTexts2(),
  });
}

Widget.defaultProps = WidgetProps;
