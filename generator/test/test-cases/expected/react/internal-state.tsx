function view(model:Widget) {
  return <span></span>;
}

import React, { useState, useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget{
  _hovered: Boolean;
  updateState: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: {} & RestProps) {

  const [__state__hovered, __state_set_hovered] = useState(false);

  const updateState = useCallback(function updateState(): any {
    __state_set_hovered(__state__hovered => !__state__hovered);
  }, [__state__hovered]);

  const __restAttributes=useCallback(function __restAttributes(): RestProps{
    const { ...restProps } = props;
    return restProps;
  }, [props]);

  return view(({
    ...props,
    _hovered: __state__hovered,
    updateState,
    restAttributes: __restAttributes()
  }));
}
