function view() {}

import React, { useCallback, useEffect, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof {}>;
interface Widget {
  onPointerUp: () => any;
  scrollHandler: () => any;
  restAttributes: RestProps;
}

export function Widget(props: {} & RestProps) {
  const onPointerUp = useCallback(function onPointerUp(): any {}, []);
  const scrollHandler = useCallback(function scrollHandler(): any {}, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", scrollHandler);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", scrollHandler);
    };
  });
  return view();
}

export default Widget;
