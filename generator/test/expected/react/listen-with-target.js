import { useCallback } from 'react';

function viewModel() {}

function view() {}

export default function Component({}) {
  const onPointerUp = useCallback(() => {}, []);
  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
    };
  });

  return view(viewModel({
    onPointerUp
  }));
}
