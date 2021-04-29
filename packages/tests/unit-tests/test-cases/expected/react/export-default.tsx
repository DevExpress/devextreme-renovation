function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  prop?: boolean;
};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { prop, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
};
export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
