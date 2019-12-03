function viewModel() { }

function view() { }

import { useCallback, useEffect } from 'react';

export function Component(props: { }) {
  const onPointerUp = useCallback(() => { }, null);
  const scrollHandler = useCallback(() => { }, null);
  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", scrollHandler);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", scrollHandler);
    };
  });

  return view(viewModel({
    ...props,
    onPointerUp,
    scrollHandler
  }));
}
