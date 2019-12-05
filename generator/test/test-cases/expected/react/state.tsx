function viewModel() { }

function view() { }

import React, { useState } from 'react';

interface Component {
  pressed?: boolean,
  defaultPressed?: boolean,
  pressedChange?: (pressed: boolean) => void
}

export default function Component(props: {
  pressed?: boolean,
  defaultPressed?: boolean,
  pressedChange?: (pressed: boolean) => void
}) {
  const [__state_pressed, __state_setPressed] = useState(() => (props.pressed !== undefined ? props.pressed : props.defaultPressed) || undefined);

  function updateState() {
    __state_setPressed(!(props.pressed !== undefined ? props.pressed : __state_pressed));
    props.pressedChange!(!(props.pressed !== undefined ? props.pressed : __state_pressed));
  }

  return view(viewModel({
    ...props,
    pressed: props.pressed !== undefined ? props.pressed : __state_pressed
  }));
}

Component.defaultProps = {
  pressedChange: () => { }
}
