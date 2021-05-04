import {
  Component,
  ComponentBindings,
  JSXComponent,
  Method,
} from "@devextreme-generator/declarations";

function view(model: Widget) :JSX.Element|null {
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
