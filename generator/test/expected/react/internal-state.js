import { useState } from 'react';

function viewModel() {}

function view() {}

export default function Component({}) {
  const [_state, _setState] = useState(false);

  return view(viewModel({
    _state
  }));
}
