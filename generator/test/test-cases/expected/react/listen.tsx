function view() { }

import React, { useCallback } from 'react';

interface Component {
  onClick: (e:any) => any,
  onPointerMove: (a:any, b:any, c:any) => any
}

export function Component(props: {}) {
  const onClick = useCallback((e) => { }, []);
  const onPointerMove = useCallback((a = "a", b = 0, c = true) => { }, []);

  return view(({
    ...props,
    onClick,
    onPointerMove
  }));
}