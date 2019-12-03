function viewModel() {}

function view() {}

import { useState } from 'react';

export default function Component(props: {}) {
  const __state:any = {};
  [__state._hovered, __state.set_hovered] = useState(false);
  
  function updateState() {
    state.__set_hovered(!__state._hovered);
  }

  return view(viewModel({
    ...props,
    _hovered: __state._hovered;
  }));
}
