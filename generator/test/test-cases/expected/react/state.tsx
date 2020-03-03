function viewModel() { }

function view() { }

import React, { useState, useCallback } from 'react';

interface Widget {
  pressed?: boolean;
  defaultPressed?: boolean;
  pressedChange?: (pressed: boolean) => void;
  updateState: () => any;
}

export default function Widget(props: {
  pressed?: boolean,
  defaultPressed?: boolean,
  pressedChange?: (pressed: boolean) => void
}) {
  const [__state_pressed, __state_setPressed] = useState(() => (props.pressed !== undefined ? props.pressed : props.defaultPressed) || undefined);

  const updateState = useCallback(function updateState() {
    (__state_setPressed(!(props.pressed !== undefined ? props.pressed : __state_pressed)), props.pressedChange!(!(props.pressed !== undefined ? props.pressed : __state_pressed)))
  }, [props.pressed, __state_pressed, props.pressedChange]);

  return view(viewModel({
    ...props,
    pressed: props.pressed !== undefined ? props.pressed : __state_pressed,
    updateState
  }));
}

Widget.defaultProps = {
  pressedChange: () => { }
}
