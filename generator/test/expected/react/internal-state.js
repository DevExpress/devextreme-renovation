import { useState } from 'react';

function viewModel() {}

function view() {}

export default function Component({}) {
  const [_hovered, _setHovered] = useState(false);

  function updateState() {
    _setHovered(!_hovered);
  }

  return view(viewModel({
    _hovered
  }));
}
