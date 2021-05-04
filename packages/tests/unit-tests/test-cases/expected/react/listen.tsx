function view(model: Widget): any | null {
  return <div></div>;
}

import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof {}>;
interface Widget {
  onClick: (e: Event) => any;
  onPointerMove: (a: any, b: any, c: any) => any;
  restAttributes: RestProps;
}

const Widget: React.FC<{} & RestProps> = (props) => {
  const __onClick = useCallback(function __onClick(e: Event): any {}, []);
  const __onPointerMove = useCallback(function __onPointerMove(
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
    onClick: __onClick,
    onPointerMove: __onPointerMove,
    restAttributes: __restAttributes(),
  });
};

export default Widget;

export { Widget };
