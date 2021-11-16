import {
  Component,
  ComponentBindings,
  JSXComponent,
  TwoWay,
  Event,
} from "@devextreme-generator/declarations";
import Button, { ButtonInput } from "./button";

function view(model: ButtonWithState) {
  return (
    <Button id={model.props.id} onClick={model.onButtonClick}>
      {model.props.pressed ? "Pressed" : "Unpressed"}
    </Button>
  );
}

@ComponentBindings()
class ButtonWithStateInput extends ButtonInput {
  @TwoWay() pressed: boolean = false;
  @Event() pressedChange?: (p: boolean) => void = () => null;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class ButtonWithState extends JSXComponent(
  ButtonWithStateInput
) {
  onButtonClick() {
    this.props.pressed = !this.props.pressed;
    return null;
  }
}
