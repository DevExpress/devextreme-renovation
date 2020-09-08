import { WidgetWithProps } from "./dx-widget-with-props";
function view(model: Widget): JSX.Element {
  return <WidgetWithProps />;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import React, { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
export * from "./dx-widget-with-props";
