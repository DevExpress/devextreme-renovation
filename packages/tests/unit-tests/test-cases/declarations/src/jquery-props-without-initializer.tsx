import {
  Component,
  TwoWay,
  ComponentBindings,
  OneWay,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: Widget):JSX.Element|null {
  return <div>{model.props.state1}</div>;
}

@ComponentBindings()
class WidgetInput {
  @TwoWay() state1? = false;
  @TwoWay() state2?: string;
  @TwoWay() state3?: (e: any) => number = (e: any) => {
    return e.num;
  };
  @TwoWay() state4?: number | null;
  @OneWay() prop1?: string | null;
  @OneWay() prop2?: string;
}
@Component({
  view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent(WidgetInput) {}
