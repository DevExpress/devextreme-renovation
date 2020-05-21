function view(model:Widget) {
  return <span></span>;
}

import React, { useState, useCallback } from 'react';

interface Widget{
  _hovered: Boolean;
  updateState: () => any;
  restAttributes: any;
}

export default function Widget(props: {}) {

  const [__state__hovered, __state_set_hovered] = useState(false);

  const updateState = useCallback(function updateState() {
    __state_set_hovered(!__state__hovered);
  }, [__state__hovered]);

  const __restAttributes=useCallback(function __restAttributes(){
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
