function view(model: Widget) {
  return <div>{model.props.pressed}</div>;
}
declare type WidgetInput = {
  pressed?: boolean;
  defaultPressed?: boolean;
  pressedChange?: (pressed: boolean) => void;
}
const WidgetInput: WidgetInput = {
  pressed: false,
  pressedChange: () => { }
};

import React, { useState, useCallback } from 'react';

interface Widget {
  props: WidgetInput;
  updateState: () => any;
}

export default function Widget(props: WidgetInput) {


  const [__state_pressed, __state_setPressed] = useState(() => (props.pressed !== undefined ? props.pressed : props.defaultPressed) || false);
  const updateState = useCallback(function updateState() {
    (__state_setPressed(!(props.pressed !== undefined ? props.pressed : __state_pressed)), props.pressedChange!(!(props.pressed !== undefined ? props.pressed : __state_pressed)))
  }, [props.pressed, __state_pressed, props.pressedChange]);
  return view(({
    props: {
      ...props,
      pressed: props.pressed !== undefined ? props.pressed : __state_pressed
    },
    updateState
  })
  );
}

Widget.defaultProps = {
  ...WidgetInput,
  pressedChange: () => { }
}