import React, { useCallback, useState } from "react";
import Button from "./Button";

function viewModel(model) {
  return { ...model };
}

function view(viewModel) {
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

export default function ToggleButton({
  height,
  hint,
  stylingMode,
  text,
  type,
  width,
  pressed,
  pressedChange = () => {}
}) {
  const [_pressed, _setPressed] = useState(() => pressed);

  const onClickHandler = useCallback(() => {
    const newPressed = !(pressed !== undefined ? pressed : _pressed);
    _setPressed(newPressed);
    pressedChange(newPressed);
  }, [_pressed, pressed, pressedChange]);

  return view({ 
    // listeners
    onClickHandler,
    ...viewModel({
      // props
      height,
      hint,
      stylingMode,
      text,
      type,
      width,
      // state
      pressed: pressed !== undefined ? pressed : _pressed
      // internal state
    })
  });
}

export class ToggleButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onClickHandler = this.onClickHandler.bind(this);

    if(!("pressed" in this.props) && ("defaultPressed" in this.props) ){
      this.state.pressed = this.props.defaultPressed;
    }
  }

  get pressed() {
    return "pressed" in this.props ? this.props.pressed : this.state.pressed;
  }

  set pressed(pressed) {
    this.setState({ pressed });
    this.pressedChange(pressed);
  }

  get pressedChange() {
    return this.props.pressedChange || (() => {});
  }

  onClickHandler(e) {
    this.pressed = !this.pressed;
  }

  viewModel(model) {
    return { ...model };
  }
  
  view(viewModel) {
    return (
      <Button
        height={viewModel.height}
        hint={viewModel.hint}
        stylingMode={viewModel.stylingMode}
        text={viewModel.text}
        type={viewModel.type}
        width={viewModel.width}
        pressed={viewModel.pressed}
        onClick={this.onClickHandler}/>
    );
  }

  getModel() {
    return { ...this.props, ...this.state };
  }

  render() {
    return this.view(this.viewModel(this.getModel()));
  }
};
