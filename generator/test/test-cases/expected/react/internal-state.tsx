function view() { }

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

  const restAttributes=useCallback(function restAttributes(){
    const { ...restProps } = props;
    return restProps;
  }, [props]);

  return view(({
    ...props,
    _hovered: __state__hovered,
    updateState,
    restAttributes: restAttributes()
  }));
}
