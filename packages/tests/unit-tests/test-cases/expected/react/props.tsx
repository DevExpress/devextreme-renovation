function view(model: Widget): any {
  const sizes = model.props.sizes ?? { width: 0, height: 0 };
  return (
    <span>
      {sizes.height}

      {sizes.width}
    </span>
  );
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  height: number;
  export: object;
  sizes?: { height: number; width: number };
  stringValue: string;
  onClick: (a: number) => void;
  onSomething: EventCallBack<number>;
  defaultStringValue: string;
  stringValueChange?: (stringValue: string) => void;
};
export const WidgetInput: WidgetInputType = {
  height: 10,
  get export() {
    return {};
  },
  onClick: () => {},
  onSomething: () => {},
  defaultStringValue: "",
  stringValueChange: () => {},
} as any as WidgetInputType;
import * as React from "react";
import { useState, useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: () => number;
  getRestProps: () => { export: object; onSomething: EventCallBack<number> };
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const [__state_stringValue, __state_setStringValue] = useState<string>(() =>
    props.stringValue !== undefined
      ? props.stringValue
      : props.defaultStringValue!
  );

  const __getHeight = useCallback(
    function __getHeight(): number {
      props.onClick(10);
      const { onClick } = props;
      onClick(11);
      return props.height;
    },
    [props.onClick, props.height]
  );
  const __getRestProps = useCallback(
    function __getRestProps(): {
      export: object;
      onSomething: EventCallBack<number>;
    } {
      const { height, onClick, ...rest } = {
        ...props,
        stringValue:
          props.stringValue !== undefined
            ? props.stringValue
            : __state_stringValue,
      };
      return rest;
    },
    [props, __state_stringValue]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultStringValue,
        export: exportProp,
        height,
        onClick,
        onSomething,
        sizes,
        stringValue,
        stringValueChange,
        ...restProps
      } = {
        ...props,
        stringValue:
          props.stringValue !== undefined
            ? props.stringValue
            : __state_stringValue,
      };
      return restProps;
    },
    [props, __state_stringValue]
  );

  return view({
    props: {
      ...props,
      stringValue:
        props.stringValue !== undefined
          ? props.stringValue
          : __state_stringValue,
    },
    getHeight: __getHeight,
    getRestProps: __getRestProps,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetInput;
