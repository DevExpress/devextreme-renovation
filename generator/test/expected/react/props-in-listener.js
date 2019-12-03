function viewModel() { }

function view() { }

import { useCallback } from 'react';

export function Component({
    type,
    onClick
 }) {
    const clickHandler = useCallback(() => {
        onClick({
            type: type
        })
    }, []);

  return view(viewModel({
    type,
    clickHandler
  }));
}