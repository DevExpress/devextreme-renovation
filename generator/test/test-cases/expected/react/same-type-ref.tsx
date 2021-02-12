import BaseWidget from "./method";
function view(viewModel: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  nullableRef?: MutableRefObject<HTMLDivElement>;
};
const WidgetInput: WidgetInputType = {};
import { WidgetRef as BaseWidgetRef } from "./method";
import * as React from "react";
import { useCallback, useRef, MutableRefObject, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef1: any;
  divRef2: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __divRef1 = useRef<BaseWidgetRef>();
  const __divRef2 = useRef<BaseWidgetRef>();

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = {
        ...props,
        nullableRef: props.nullableRef?.current!,
      };
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef1: __divRef1,
    divRef2: __divRef2,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
