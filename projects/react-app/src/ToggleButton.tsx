import React, { useCallback, useState } from "react";
import Button from "./Button";

const ToggleButton = (props: {
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
  const [pressed, setPressed] = useState(() => ((props.pressed !== undefined) ? props.pressed : props.defaultPressed) || false);

  const onClickHandler = useCallback(function(e: any) {
    const newPressed = !(props.pressed !== undefined ? props.pressed : pressed);
    setPressed(newPressed);
    props.pressedChange!(newPressed);
  }, [pressed, props.pressed, props.pressedChange]);

  return view(viewModel({
    // props
    ...props,
    // state
    pressed: props.pressed !== undefined ? props.pressed : pressed,
    // internal state
    // listeners
    onClickHandler
  }));
}

ToggleButton.defaultProps = {
  pressedChange: () => {}
};

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
