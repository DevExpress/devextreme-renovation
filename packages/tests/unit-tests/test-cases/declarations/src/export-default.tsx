import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: Widget) :JSX.Element|null {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {
  @OneWay() prop?: boolean;
}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetInput) {}
