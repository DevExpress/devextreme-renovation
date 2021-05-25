import {
  Component,
  ComponentBindings,
  JSXComponent,
  TwoWay,
  Event,
  InternalState,
  Effect,
  OneWay,
} from "@devextreme-generator/declarations";
import Button, { ButtonInput } from "./button";

function view(model: ButtonWithInternalState) {
  return (
    <Button id={model.props.id} onClick={model.onButtonClick}>
      {model.props.pressed ? "Pressed" : "Unpressed"}
      {" - Internal State is "}
      {model.innerState === model.props.pressed ? "Synchronized" : "Not Synchronized" }
    </Button>
  );
}

@ComponentBindings()
class ButtonWithInternalStateInput extends ButtonInput {
  @TwoWay() pressed: boolean = false;
  @OneWay() synchronizedWithPressed: boolean = false;
  @Event() pressedChange?: (p: boolean) => void = () => null;
}

@Component({
  view,
})
export default class ButtonWithInternalState extends JSXComponent(
  ButtonWithInternalStateInput
) {
  @InternalState() innerState: boolean = false;

  @Effect()
  synchronizeInternalState() {
    this.innerState = this.synchronizedValue;
  }

  get synchronizedValue() {
    return this.props.synchronizedWithPressed;
  }

  onButtonClick() {
    this.props.pressed = !this.props.pressed;
  }
}
