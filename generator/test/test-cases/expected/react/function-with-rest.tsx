const someFunction = (arg1: number, arg2: string, ...args: object[]) => {};

export declare type WidgetInputType = {};
export const WidgetInput: WidgetInputType = {};

import React, { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  someMethod: (args: object[]) => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const someMethod = useCallback(function someMethod(...args: object[]): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    someMethod,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};

function view(viewModel: Widget) {
  return <div></div>;
}
