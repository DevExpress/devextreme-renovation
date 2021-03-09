import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
} from "@devextreme-generator/declaration";

function view(model: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}
@Component({
  view,
})
export class Widget extends JSXComponent(WidgetInput) {
  @Method()
  getValue() {
    return 0;
  }
}
