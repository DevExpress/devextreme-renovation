function viewModel() { }

function view() { }

import { useCallback, useEffect } from 'react';

export function Component({ }) {
  const onPointerUp = useCallback(() => { }, []);
  const scrollHandler = useCallback(() => { }, []);
  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", scrollHandler);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", scrollHandler);
    };
  });

  return view(viewModel({
    onPointerUp,
    scrollHandler
  }));
}
