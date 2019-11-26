import { useState } from 'react';

function viewModel() {}

function view() {}

export default function Component({}) {
  const [_hovered, _set_hovered] = useState(false);

  function updateState() {
    _set_hovered(!_hovered);
  }

  return view(viewModel({
    _hovered
  }));
}
