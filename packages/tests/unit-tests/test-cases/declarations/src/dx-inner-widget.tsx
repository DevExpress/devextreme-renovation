import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Event,
  TwoWay,
} from "@devextreme-generator/declarations";

function view(model: InnerWidget) {
  return <div style={{ width: 100, height: 100 }}></div>;
}

@ComponentBindings()
export class InnerWidgetProps {
  @OneWay() selected?: boolean;
  @TwoWay() value = 14;
  @Event() onSelect?: (e: any) => any;
}

@Component({
  view: view,
})
export default class InnerWidget extends JSXComponent(InnerWidgetProps) {}
