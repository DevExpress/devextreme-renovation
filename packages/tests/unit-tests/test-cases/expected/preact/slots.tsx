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
  namedSlot?: any;
  namedSlotWithSelector?: any;
  children?: any;
};
const SlotsWidgetProps: SlotsWidgetPropsType = {};
import * as Preact from "preact";
import { useCallback } from "preact/hooks";

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
