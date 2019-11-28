function viewModel() {}

function view() {}

import { useCallback } from 'react';

export function Component({}) {
  const onClick = useCallback((e) => {}, []);
  const onPointerMove = useCallback((a = "a", b = 0, c = true) => {}, []);

  return view(viewModel({
    onClick,
    onPointerMove
  }));
}
