function view(model: Widget): any {
  return <span></span>;
}
type EventCallBack<Type> = (e: Type) => void;

export declare type WidgetInputType = {
  someProp?: { current: string };
};
export const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  someState?: { current: string };
  concatStrings: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const [__state_someState, __state_setSomeState] = useState<
    { current: string } | undefined
  >(undefined);

  const __concatStrings = useCallback(
    function __concatStrings(): any {
      const fromProps = props.someProp?.current || "";
      const fromState = __state_someState?.current || "";
      return `${fromProps}${fromState}`;
    },
    [props.someProp, __state_someState]
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
    concatStrings: __concatStrings,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
