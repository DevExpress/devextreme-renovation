function view(model: Widget): JSX.Element {
  return <span></span>;
}

export declare type WidgetInputType = {
  height: number;
  export: object;
  onClick: (a: number) => void;
};
const WidgetInput: WidgetInputType = {
  height: 10,
  export: {},
  onClick: () => {},
};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  getHeight: () => number;
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
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { export: exportProp, height, onClick, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getHeight: __getHeight,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
