import {
  Component,
  TwoWay,
  ComponentBindings,
  JSXComponent,
  InternalState,
} from "@devextreme-generator/declarations";
import BaseState from "./model";

function view(model: Widget) {
  return (
    <div>
      {model.props.state1}
      <BaseState baseStatePropChange={model.stateChange}></BaseState>
    </div>
  );
}

@ComponentBindings()
class WidgetInput {
  @TwoWay() state1?: boolean = false;
  @TwoWay() state2 = false;
  @TwoWay() stateProp?: boolean;
}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() internalState: number = 0;
  innerData?: string;
  updateState() {
    this.props.state1 = !this.props.state1;
  }

  updateState2() {
    const cur = this.props.state2;
    this.props.state2 = cur !== false ? false : true;
  }

  updateState3(state: boolean) {
    this.props.state2 = state
  }

  updateInnerState(state: number) {
    this.internalState = state;
  }

  destruct() {
    const { state1 } = this.props;
    const s = state1;
  }

  stateChange(stateProp?: boolean) {
    this.props.stateProp = stateProp;
  }
}
