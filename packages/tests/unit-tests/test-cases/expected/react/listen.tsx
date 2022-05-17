

function view(model: Widget) {
  return <div></div>;
}

import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  onClick: (e: Event) => any;
  onPointerMove: (a: any, b: any, c: any) => any;
  restAttributes: RestProps;
}
export function Widget(props: {} & RestProps) {
  const __onClick = useCallback(function __onClick(e: Event): any {}, []);
  const __onPointerMove = useCallback(function __onPointerMove(
    a = 'a',
    b = 0,
    c = true
  ): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    ...props,
    onClick: __onClick,
    onPointerMove: __onPointerMove,
    restAttributes: __restAttributes(),
  });
}

export default Widget;
