function view(model: Widget) {
  return <div></div>;
}

import React, { useCallback, HtmlHTMLAttributes } from "react";

declare type RestProps = Omit<HtmlHTMLAttributes<HTMLDivElement>, keyof {}>;
interface Widget {
  onClick: (e: Event) => any;
  onPointerMove: (a: any, b: any, c: any) => any;
  restAttributes: RestProps;
}

export function Widget(props: {} & RestProps) {
  const onClick = useCallback(function onClick(e: Event): any {}, []);
  const onPointerMove = useCallback(function onPointerMove(
    a = "a",
    b = 0,
    c = true
  ): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    ...props,
    onClick,
    onPointerMove,
    restAttributes: __restAttributes(),
  });
}

export default Widget;
