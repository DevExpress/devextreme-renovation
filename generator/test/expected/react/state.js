import { useState } from 'react';

export default function Component({
  pressed,
  pressedChange = () => {}
}) {
  const [_pressed, _setPressed] = useState(() => pressed);
  
  function updateState() {
    let curPressed = !(pressed !== undefined ? pressed : _pressed);
    _setPressed(curPressed);
    pressedChange(curPressed);
  }
  
  return view(viewModel({
    pressed: pressed !== undefined ? pressed : _pressed
  }));
}
