function viewModel() { }

function view() { }

import { useCallback } from 'react';

export function Component(props: { }) {
  const onClick = useCallback((e) => { }, null);
  const onPointerMove = useCallback((a = "a", b = 0, c = true) => { }, null);

  return view(viewModel({
    ...props,
    onClick,
    onPointerMove
  }));
}