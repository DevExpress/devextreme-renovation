function viewModel() { }

function view() { }

import React, { useState } from 'react';

export default function Component(props: {}) {

  const [__state__hovered, __state_set_hovered] = useState(false);

  function updateState() {
    __state_set_hovered(!__state__hovered);
  }

  return view(viewModel({
    ...props,
    _hovered: __state__hovered;
  }));
}
