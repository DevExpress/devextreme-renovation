import Props from "./component-bindings-only";
function view(model: Widget) {
  return <div>{model.props.height}</div>;
}
export declare type WidgetPropsType = {
  height?: number;
};
const WidgetProps: WidgetPropsType = {
  height: Props.height,
};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps
>;
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetProps,
};
