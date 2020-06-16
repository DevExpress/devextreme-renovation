function view(model: Widget) {
  return <div ></div>;
}

import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget {
  onClick: (e: Event) => any;
  onPointerMove: (a: any, b: any, c: any) => any;
  restAttributes: RestProps;
}

export function Widget(props: {

} & RestProps) {
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
