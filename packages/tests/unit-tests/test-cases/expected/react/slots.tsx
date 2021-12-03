function view(viewModel: SlotsWidget) {
  return (
    <div>
      <div>{viewModel.props.namedSlotWithSelector}</div>

      <div>{viewModel.props.namedSlot}</div>

      <div>{viewModel.props.children}</div>
    </div>
  );
}

export declare type SlotsWidgetPropsType = {
  namedSlot?: React.ReactNode;
  namedSlotWithSelector?: React.ReactNode;
  children?: React.ReactNode;
};
const SlotsWidgetProps: SlotsWidgetPropsType = {};
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface SlotsWidget {
  props: typeof SlotsWidgetProps & RestProps;
  restAttributes: RestProps;
}

export default function SlotsWidget(
  props: typeof SlotsWidgetProps & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, namedSlot, namedSlotWithSelector, ...restProps } =
        props;
      return restProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

SlotsWidget.defaultProps = SlotsWidgetProps;
