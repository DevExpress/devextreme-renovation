function viewModel() { }

function view() { }

import React, { useCallback } from 'react';

interface Component {
  onClick: (e) => void,
  onPointerMove: (a, b, c) => void
}

export function Component(props: {}) {
  const onClick = useCallback((e) => { }, []);
  const onPointerMove = useCallback((a = "a", b = 0, c = true) => { }, []);

  return view(viewModel({
    ...props,
    onClick,
    onPointerMove
  }));
}