function view(model: Widget) {
  return <span></span>;
}

import * as React from "react";
import { useState, useCallback, DOMAttributes, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof {} | keyof DOMAttributes<HTMLElement>
>;
interface Widget {
  _hovered: Boolean;
  updateState: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: {} & RestProps) {
  const [__state__hovered, __state_set_hovered] = useState<Boolean>(false);

  const __updateState = useCallback(
    function __updateState(): any {
      __state_set_hovered((__state__hovered) => !__state__hovered);
    },
    [__state__hovered]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    ...props,
    _hovered: __state__hovered,
    updateState: __updateState,
    restAttributes: __restAttributes(),
  });
}
