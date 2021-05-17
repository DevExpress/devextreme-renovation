function view(model: Widget): any {
  return model.props.children;
}

export declare type WidgetInputType = {
  children?: React.ReactNode;
};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, DOMAttributes, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput | keyof DOMAttributes<HTMLElement>
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

Widget.defaultProps = {
  ...WidgetInput,
};
