function view() {

}

import React, { useCallback, useEffect } from 'react';

interface Widget {
  onPointerUp: () => any;
  scrollHandler: () => any;
  restAttributes: any;
}

export function Widget(props: {

}) {
  const onPointerUp = useCallback(function onPointerUp() {

  }, []);
  const scrollHandler = useCallback(function scrollHandler() {

  }, []);
  const __restAttributes = useCallback(function __restAttributes() {
    const { ...restProps } = props
    return restProps;
  }, [props]);
  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", scrollHandler);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", scrollHandler);
    }
  });
  return view(

  );
}
