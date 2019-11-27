function viewModel() {}

function view() {}

import { useState } from 'react';

export default function Component({
  pressed,
  defaultPressed,
  pressedChange = () => { }
}) {
  const [_pressed, _setPressed] = useState(() => (pressed !== undefined) ? pressed : defaultPressed);

  function updateState() {
    _setPressed(!(pressed !== undefined ? pressed : _pressed));
    pressedChange(!(pressed !== undefined ? pressed : _pressed));
  }

  return view(viewModel({
    pressed: pressed !== undefined ? pressed : _pressed
  }));
}

