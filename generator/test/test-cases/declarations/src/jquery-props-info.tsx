import {
  Component,
  TwoWay,
  ComponentBindings,
  OneWay,
  JSXComponent,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return <div>{model.props.state1}</div>;
}

@ComponentBindings()
class WidgetInput {
  @TwoWay() state1?: boolean = false;
  @TwoWay() state2?: string = "default value";
  @TwoWay() state3?: (e: any) => number = (e: any) => {
    return e.num;
  };
  @TwoWay() state4: number | null = null;
  @OneWay() prop1: string | null = "default";
  @OneWay() prop2: string = "default";
}
@Component({
  view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent(WidgetInput) {}
