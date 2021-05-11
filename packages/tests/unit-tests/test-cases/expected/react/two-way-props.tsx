function view(model: Widget) {
  return <span></span>;
}

export declare type WidgetInputType = {
  height: number;
  selected: boolean;
  defaultSelected: boolean;
  selectedChange?: (selected: boolean) => void;
};
const WidgetInput: WidgetInputType = {
  height: 10,
  defaultSelected: false,
  selectedChange: () => {},
} as any as WidgetInputType;
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: () => number;
  getProps: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const [__state_selected, __state_setSelected] = useState<boolean>(() =>
    props.selected !== undefined ? props.selected : props.defaultSelected!
  );

  const __getHeight = useCallback(
    function __getHeight(): number {
      const { height } = props;
      const { height: _height } = props;
      return height + _height;
    },
    [props.height]
  );
  const __getProps = useCallback(
    function __getProps(): any {
      return {
        ...props,
        selected:
          props.selected !== undefined ? props.selected : __state_selected,
      };
    },
    [props, __state_selected]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultSelected,
        height,
        selected,
        selectedChange,
        ...restProps
      } = {
        ...props,
        selected:
          props.selected !== undefined ? props.selected : __state_selected,
      };
      return restProps;
    },
    [props, __state_selected]
  );

  return view({
    props: {
      ...props,
      selected:
        props.selected !== undefined ? props.selected : __state_selected,
    },
    getHeight: __getHeight,
    getProps: __getProps,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
