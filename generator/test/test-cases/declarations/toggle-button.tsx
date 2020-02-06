import Button from './button';

@Component({
  name: 'ToggleButton',
  components: [Button],
  viewModel: viewModelFunction,
  view: viewFunction
})

export default class ToggleButton {
  @OneWay() height?: string;
  @OneWay() hint?: string;
  @OneWay() stylingMode?: string;
  @OneWay() text?: string;
  @OneWay() type?: string;
  @OneWay() width?: string;

  @TwoWay() pressed?: boolean = false;

  @Listen("click")
  onClickHandler(e: any) {
    this.pressed = !this.pressed;
  }
}

function viewModelFunction(model: ToggleButton) {
  return { ...model };
}

function viewFunction(viewModel: any) {
  return (
    <Button
      height={viewModel.height}
      hint={viewModel.hint}
      stylingMode={viewModel.stylingMode}
      text={viewModel.text}
      type={viewModel.type}
      width={viewModel.width}
      pressed={viewModel.pressed}
      click={viewModel.onClickHandler} />
  );
}
