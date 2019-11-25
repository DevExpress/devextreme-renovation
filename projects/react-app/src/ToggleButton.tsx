import React, { useCallback, useState } from "react";
import Button from "./Button";

const ToggleButton = ({
  height,
  hint,
  pressed,
  defaultPressed,
  pressedChange = () => {},
  stylingMode,
  text,
  type,
  width
}: {
  height?: string,
  hint?: string,
  pressed?: boolean,
  defaultPressed?: boolean,
  pressedChange?: (e: boolean) => void,
  stylingMode?: string,
  text?: string,
  type?: string,
  width?: string
}) => {
  const [_pressed, _setPressed] = useState(() => (pressed !== undefined) ? pressed : defaultPressed);

  const onClickHandler = useCallback(() => {
    const newPressed = !(pressed !== undefined ? pressed : _pressed);
    _setPressed(newPressed);
    pressedChange(newPressed);
  }, [_pressed, pressed, pressedChange]);

  return view(viewModel({
    // props
    height,
    hint,
    stylingMode,
    text,
    type,
    width,
    // state
    pressed: pressed !== undefined ? pressed : _pressed,
    // internal state
    // listeners
    onClickHandler
  }));
}

function viewModel(model: any) {
  return { ...model };
}

function view(viewModel: any) {
  return (
    <Button
      height={viewModel.height}
      hint={viewModel.hint}
      stylingMode={viewModel.stylingMode}
      text={viewModel.text}
      type={viewModel.type}
      width={viewModel.width}
      pressed={viewModel.pressed}
      onClick={viewModel.onClickHandler}/>
  );
}

export default ToggleButton;
