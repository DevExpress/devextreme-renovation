function viewModel() { }

function view() { }

import React, { useCallback, useEffect } from 'react';

interface Component {
  onPointerUp: () => any;
  scrollHandler: () => any;
  restAttributes: any;
}
export function Component(props: {}) {
  const onPointerUp = useCallback(() => { }, []);
  const scrollHandler = useCallback(() => { }, []);
  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", scrollHandler);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", scrollHandler);
    };
  });
  const restAttributes=useCallback(function restAttributes(){
    const { ...restProps } = props;
    return restProps;
  }, [props]);

  return view(viewModel({
    ...props,
    onPointerUp,
    scrollHandler,
    restAttributes: restAttributes()
  }));
}
