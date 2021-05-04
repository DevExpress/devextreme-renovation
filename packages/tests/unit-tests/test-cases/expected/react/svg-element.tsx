export declare type WidgetInputType = {};
export const WidgetInput: WidgetInputType = {};
const view = (viewModel: Widget): any | null => (
  <svg {...viewModel.restAttributes}></svg>
);

import * as React from "react";
import { useCallback, SVGAttributes } from "react";

declare type RestProps = Omit<
  SVGAttributes<SVGElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
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
