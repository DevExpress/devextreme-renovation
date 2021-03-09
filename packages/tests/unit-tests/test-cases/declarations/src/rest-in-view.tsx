import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
  TwoWay,
} from "@devextreme-generator/declaration";

function view({ props: { height, ...rest } }: Widget) {
  return <span>{rest}</span>;
}

@ComponentBindings()
class WidgetInput {
  @OneWay() height: number = 10;
  @Event() onClick: (a: number) => null = () => null;
  @TwoWay() p?: string = "";
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {}
