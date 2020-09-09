import BaseProps from "./component-bindings-only";
const view = (model: Widget) => <span />;

interface PropsI {
  p: string;
}

interface WidgetI {
  onClick(): void;
}

export declare type WidgetInputType = typeof BaseProps & {
  p: string;
};
const WidgetInput: WidgetInputType = {
  ...BaseProps,
  p: "10",
};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  onClick: () => void;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __onClick = useCallback(function __onClick(): void {}, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { data, height, info, p, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    onClick: __onClick,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
