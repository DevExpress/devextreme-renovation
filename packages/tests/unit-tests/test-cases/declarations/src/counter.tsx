import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  InternalState,
} from "@devextreme-generator/declarations";

function view(model: Counter) {
  return (
    <button id={model.props.id} onClick={model.onClick}>
      {model.value}
    </button>
  );
}

@ComponentBindings()
export class CounterInput {
  @OneWay() id?: string;
}

@Component({
  view,
  defaultOptionRules: null,
  jQuery: {register: true},
})
export default class Counter extends JSXComponent(CounterInput) {
  @InternalState() value = 1;

  onClick() {
    this.value = this.value + 1;
  }
}
