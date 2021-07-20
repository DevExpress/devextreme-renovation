function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  someProp?: { current: string };
};
export const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useState, useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  someState?: { current: string };
  existsState: { current: string };
  concatStrings: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const [__state_someState, __state_setSomeState] =
    useState<{ current: string } | undefined>(undefined);
  const [__state_existsState, __state_setExistsState] = useState<{
    current: string;
  }>({ current: "value" });

  const __concatStrings = useCallback(
    function __concatStrings(): any {
      const fromProps = props.someProp?.current || "";
      const fromState = __state_someState?.current || "";
      return `${fromProps}${fromState}${__state_existsState.current}`;
    },
    [props.someProp, __state_someState, __state_existsState]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { someProp, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    someState: __state_someState,
    existsState: __state_existsState,
    concatStrings: __concatStrings,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetInput;
