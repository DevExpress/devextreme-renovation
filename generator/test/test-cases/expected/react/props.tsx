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
  onClick: (a: number) => void;
  onSomething: EventCallBack<number>;
};
export const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => {},
  onSomething: () => {},
};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: () => number;
  getRestProps: () => { export: object; onSomething: EventCallBack<number> };
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
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
      const { height, onClick, ...rest } = props;
      return rest;
    },
    [props]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        export: exportProp,
        height,
        onClick,
        onSomething,
        sizes,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getHeight: __getHeight,
    getRestProps: __getRestProps,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
