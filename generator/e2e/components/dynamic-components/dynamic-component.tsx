import {
  Component,
  ComponentBindings,
  InternalState,
  JSXComponent,
  JSXTemplate,
} from "../../../component_declaration/common";

import Button, { CounterInput } from "../counter";
import Button1 from "../button";

function view({
  ButtonComponent,
  ButtonComponents,
  onClick,
  value,
}: DynamicComponent) {
  return (
    <div>
      <ButtonComponent value={value} valueChange={onClick}></ButtonComponent>
      <div>----</div>
      {value > 20 && value < 1000 && (
        <ButtonComponent value={value + 1} valueChange={onClick} />
      )}
      <div>----</div>
      {ButtonComponents.map((B) => (
        <B value={value} />
      ))}
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

  get ButtonComponent(): JSXTemplate<CounterInput> {
    return Button;
  }

  get ButtonComponents(): JSXTemplate<CounterInput>[] {
    return [Button, Button1];
  }

  onClick(e: number) {
    this.value = e * 2;
  }
}
