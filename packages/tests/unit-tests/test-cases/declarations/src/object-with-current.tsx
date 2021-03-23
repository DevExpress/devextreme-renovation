import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
  InternalState,
} from "@devextreme-generator/declarations";

function view(model: Widget): JSX.Element {
  return <span></span>;
}

type EventCallBack<Type> = (e: Type) => void;

@ComponentBindings()
export class WidgetInput {
  @OneWay() someProp?: { current: string };
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  @InternalState() someState?: { current: string };
  @InternalState() existsState: { current: string } = { current: "value" };

  concatStrings() {
    const fromProps = this.props.someProp?.current || "";
    const fromState = this.someState?.current || "";

    return `${fromProps}${fromState}${this.existsState.current}`;
  }
}
