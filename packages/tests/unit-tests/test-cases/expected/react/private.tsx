function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  simpleGetter: () => any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const [__state_decoratedState, __state_setDecoratedState] = useState<string>(
    ""
  );
  const [__state_simpleState, __state_setSimpleState] = useState<string>("");

  const __privateGetter = useCallback(
    function __privateGetter(): any {
      return __state_decoratedState.concat(__state_simpleState);
    },
    [__state_decoratedState, __state_simpleState]
  );
  const __simpleGetter = useCallback(
    function __simpleGetter(): any {
      return __state_decoratedState.concat(__state_simpleState);
    },
    [__state_decoratedState, __state_simpleState]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    simpleGetter: __simpleGetter,
    restAttributes: __restAttributes(),
  });
};
export default Widget;

Widget.defaultProps = {
  ...WidgetInput,
};
