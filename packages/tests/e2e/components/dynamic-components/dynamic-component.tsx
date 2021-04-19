import {
  Component,
  ComponentBindings,
  InternalState,
  JSXComponent,
  JSXTemplate,
} from "@devextreme-generator/declarations";

import Counter, { CounterInput } from "../counter";
import Button, { ButtonInput } from "../button";
import ButtonWithTemplate, {
  Props as ButtonWithTemplateProps,
} from "../button-with-template";

function view({
  CounterComponent,
  CounterComponents,
  ButtonComponent,
  ButtonWithTemplateComponent,
  onClick,
  spread,
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

      <ButtonWithTemplateComponent
        id={"dynamic-component-button-with-template"}
        // text="10"  https://github.com/DevExpress/devextreme-renovation/issues/545
        {...spread}
          <div
            style={{
              backgroundColor: "black",
              color: "white",
            }}
          >
            Template:{text}
          </div>
        )}
      />
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

  get ButtonWithTemplateComponent(): JSXTemplate<ButtonWithTemplateProps> {
    return ButtonWithTemplate;
  }

  get spread(): { text: string} {
    return {
      text: this.value.toString()
    };
  }

  onClick(e: number) {
    this.value = e * 2;
  }
}
