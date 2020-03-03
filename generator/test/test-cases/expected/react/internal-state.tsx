function viewModel() { }

function view() { }

import React, { useState, useCallback } from 'react';

interface Widget{
  _hovered: Boolean;
  updateState: () => any;
}

export default function Widget(props: {}) {

  const [__state__hovered, __state_set_hovered] = useState(false);

  const updateState = useCallback(function updateState() {
    __state_set_hovered(!__state__hovered);
  }, [__state__hovered]);

  return view(viewModel({
    ...props,
    _hovered: __state__hovered,
    updateState
  }));
}
