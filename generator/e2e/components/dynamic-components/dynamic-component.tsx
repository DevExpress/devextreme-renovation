import {
  Component,
  ComponentBindings,
  InternalState,
  JSXComponent,
  JSXTemplate,
} from "../../../component_declaration/common";

import Counter, { CounterInput } from "../counter";

import Button, { ButtonInput } from "../button";

function view({
  CounterComponent,
  CounterComponents,
  ButtonComponent,
  onClick,
  value,
}: DynamicComponent) {
  return (
    <div id={"dynamic-component-container"}>
      <CounterComponent
        id={"dynamic-component"}
        value={value}
        valueChange={onClick}
      />
      <div>----</div>
      {value > 1 && value < 26 && (
        <CounterComponent
          id={"dynamic-component-condition"}
          value={value + 1}
          valueChange={onClick}
        ></CounterComponent>
      )}
      <div>----</div>
      {CounterComponents.map((B, index) => (
        <span key={index} className={"dynamic-component-array"}>
          <B value={value} valueChange={onClick} />
        </span>
      ))}
      <span>|</span>
      <ButtonComponent id="dynamic-component-slot">
        Slot:<span>{value}</span>
      </ButtonComponent>
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class DynamicComponent extends JSXComponent(Props) {
  @InternalState() value = 1;

  get CounterComponent(): JSXTemplate<CounterInput> {
    return Counter as JSXTemplate<CounterInput>;
  }

  get CounterComponents(): JSXTemplate<CounterInput>[] {
    return [Counter, Counter] as JSXTemplate<CounterInput>[];
  }

  get ButtonComponent(): JSXTemplate<ButtonInput> {
    return Button;
  }

  onClick(e: number) {
    this.value = e * 2;
  }
}
