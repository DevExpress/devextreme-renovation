function viewModel() { }

function view() { }

import React, { useCallback, useEffect, useRef } from 'react';

interface Component {
  onPointerUp: () => void
}
export function Component(props: {}) {
  const divRef = useRef<HTMLDivElement>();
  const onPointerUp = useCallback(() => { }, []);
  useEffect(() => {
    divRef.current!.addEventListener("pointerup", onPointerUp);
    return function cleanup() {
      divRef.current!.removeEventListener("pointerup", onPointerUp);
    };
  });

  return view(viewModel({
    ...props,
    onPointerUp,
    divRef
  }));
}
