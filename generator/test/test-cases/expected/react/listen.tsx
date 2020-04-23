function view() { }

import React, { useCallback } from 'react';

interface Component {
  onClick: (e:any) => any;
  onPointerMove: (a:any, b:any, c:any) => any;
  restAttributes: any;
}

export function Component(props: {}) {
  const onClick = useCallback(function onClick(e){ }, []);
  const onPointerMove = useCallback(function onPointerMove(a = "a", b = 0, c = true) { }, []);
  
  const __restAttributes=useCallback(function __restAttributes(){
    const { ...restProps } = props;
    return restProps;
  }, [props]);

  return view(({
    ...props,
    onClick,
    onPointerMove,
    restAttributes: __restAttributes()
  }));
}
