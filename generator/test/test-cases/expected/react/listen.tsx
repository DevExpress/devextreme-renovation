function view(model: Widget) {
  return <div ></div>;
}

import React, { useCallback } from 'react';

interface Widget {
  onClick: (e: Event) => any;
  onPointerMove: (a: any, b: any, c: any) => any;
  restAttributes: any;
}

export function Widget(props: {

}) {
  const onClick = useCallback(function onClick(e: Event) {

  }, []);
  const onPointerMove = useCallback(function onPointerMove(a = "a", b = 0, c = true) {

  }, []);
  const __restAttributes = useCallback(function __restAttributes() {
    const { ...restProps } = props
    return restProps;
  }, [props]);

  return view(
    ({
      ...props,
      onClick,
      onPointerMove,
      restAttributes: __restAttributes()
    })
  );
}
