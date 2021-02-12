import { WidgetRef } from "../../expected/react/export-named-api-ref";
function view(viewModel: Widget) {
  return <div></div>;
}

export declare type WidgetInputType = {
  nullableRef?: MutableRefObject<HTMLDivElement>;
};
const WidgetInput: WidgetInputType = {};
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
  const __divRef1 = useRef<WidgetRef>();
  const __divRef2 = useRef<WidgetRef>();

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
