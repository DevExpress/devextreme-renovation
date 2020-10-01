import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Event,
} from "../../component_declaration/common";
import Button from "./button";

function view(model: Counter) {
  return (
    <Button id={model.props.id} onClick={model.onClick}>
      {model.props.value}
    </Button>
  );
}

@ComponentBindings()
export class CounterInput {
  @OneWay() id?: string;
  @TwoWay() value: number = 0;
  @Event() valueChange: (e: number) => void = () => {};
}

@Component({
  view,
})
export default class Counter extends JSXComponent(CounterInput) {
  onClick() {
    this.props.value = this.props.value + 1;
  }
}
