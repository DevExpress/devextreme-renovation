import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";

function view(model: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {
  @OneWay() prop?: boolean;
}
@Component({
  view,
})
export class Widget extends JSXComponent(WidgetInput) {}
