function view(model: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useState, useCallback, DOMAttributes, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput | keyof DOMAttributes<HTMLElement>
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  simpleGetter: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const [__state_decoratedState, __state_setDecoratedState] =
    useState<string>("");
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
}

Widget.defaultProps = {
  ...WidgetInput,
};
