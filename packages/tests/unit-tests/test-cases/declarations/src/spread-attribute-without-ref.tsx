import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: Widget) {
  return <div {...model.attr1}></div>;
}

@ComponentBindings()
export class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  get attr1() {
    return {};
  }
}
