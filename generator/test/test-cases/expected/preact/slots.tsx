function view(viewModel: Widget) {
  return (
    <div>
      <div>{viewModel.props.namedSlot}</div>
      <div>{viewModel.props.children}</div>
    </div>
  );
}

export declare type WidgetInputType = {
  namedSlot?: any;
  children?: any;
};
const WidgetInput: WidgetInputType = {};
import * as Preact from "preact";
import { useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, namedSlot, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  return view({
    props: { ...props },
    restAttributes: __restAttributes(),
  });
}

(Widget as any).defaultProps = {
  ...WidgetInput,
};
