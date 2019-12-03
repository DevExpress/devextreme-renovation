function viewModel() { }

function view() { }

import React, { useState } from 'react';

export default function Component(props: {
  pressed?: boolean,
  defaultPressed?: boolean,
  pressedChange?: (pressed: boolean) => void
}) {
  const __state: any = {};
  [__state.pressed, __state.setPressed] = useState(() => (props.pressed !== undefined ? props.pressed : props.defaultPressed) || undefined);

  function updateState() {
    __state.setPressed(!(props.pressed !== undefined ? props.pressed : __state.pressed));
    props.pressedChange(!(props.pressed !== undefined ? props.pressed : __state.pressed));
  }

  return view(viewModel({
    ...props,
    pressed: props.pressed !== undefined ? props.pressed : __state.pressed
  }));
}


