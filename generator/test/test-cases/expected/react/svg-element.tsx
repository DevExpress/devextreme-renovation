export declare type WidgetInputType = {};
export const WidgetInput: WidgetInputType = {};
import React, { useCallback, SVGAttributes } from "react";

declare type RestProps = Omit<
  SVGAttributes<SVGElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
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

Widget.defaultProps = {
  ...WidgetInput,
};
function view(viewModel: Widget) {
  return <svg {...viewModel.restAttributes}></svg>;
}
