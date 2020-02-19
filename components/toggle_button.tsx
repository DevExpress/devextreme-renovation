
import { Component, ComponentBindings, Listen, JSXComponent, OneWay, React, TwoWay } from '../generator/component_declaration/common';
import Button, { defaultOptionsRules as buttonRules } from './button';

export const defaultOptionsRules: { device: () => boolean, options: any }[] = buttonRules.concat([{
  device: function() {
    return true;
  },
  options: {
    hint: "Toggle button"
  }
}]);

@ComponentBindings()
export class ToggleButtonInput {
  @OneWay() height?: string;
  @OneWay() hint?: string;
  @OneWay() stylingMode?: string;
  @OneWay() text?: string;
  @OneWay() type?: string;
  @OneWay() width?: string;

  @TwoWay() pressed?: boolean = false;
  @Change() pressedChange?: (pressed: boolean) => void = (() => {});
}

@Component({
  name: 'ToggleButton',
  components: [Button],
  viewModel() {},
  view: viewFunction,
  defaultOptionsRules() {
    return defaultOptionsRules;
  }
})

export default class ToggleButton extends JSXComponent<ToggleButtonInput> {
  @Listen("click")
  onClickHandler(e: any) {
    this.props.pressed = !this.props.pressed;
  }
}

function viewFunction(viewModel: ToggleButton) {
  return (
    <Button
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      stylingMode={viewModel.props.stylingMode}
      text={viewModel.props.text}
      type={viewModel.props.type}
      width={viewModel.props.width}
      pressed={viewModel.props.pressed}
      onClick={viewModel.onClickHandler} />
  );
}
