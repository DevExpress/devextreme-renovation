import Button from './button';

@Component({
  name: 'ToggleButton',
  components: ['Button']
})

export default class ToggleButton {
  @Prop() height: String;
  @Prop() hint: String;
  @Prop() stylingMode: String;
  @Prop() text: String;
  @Prop() type: String;
  @Prop() width: String;

  @State() pressed: Boolean;

  @Listen("click")
  onClickHandler(e) {
    this.pressed = !this.pressed;
  }

  @ViewModel()
  viewModel(model) {
    return { ...model };
  }

  @View()
  view(viewModel) {
    return (
      <Button
        height={viewModel.height}
        hint={viewModel.hint}
        stylingMode={viewModel.stylingMode}
        text={viewModel.text}
        type={viewModel.type}
        width={viewModel.width}
        pressed={viewModel.pressed}/>
    );
  }
}
