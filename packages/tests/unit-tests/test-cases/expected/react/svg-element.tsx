export declare type WidgetInputType = {};
export const WidgetInput: WidgetInputType = {};
const view = (viewModel: Widget) => <svg {...viewModel.restAttributes}></svg>;

import * as React from "react";
import { useCallback, DOMAttributes, SVGAttributes } from "react";

declare type RestProps = Omit<
  SVGAttributes<SVGElement>,
  keyof typeof WidgetInput | keyof DOMAttributes<HTMLElement>
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

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

Widget.defaultProps = {
  ...WidgetInput,
};
