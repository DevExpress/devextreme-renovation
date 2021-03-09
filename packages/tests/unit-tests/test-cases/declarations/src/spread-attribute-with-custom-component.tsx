import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declaration";
import InnerWidget from "./dx-inner-widget";

function view(model: Widget) {
  return (
    <InnerWidget selected={false} {...model.attr1} {...model.restAttributes} />
  );
}

@ComponentBindings()
export class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  get attr1() {
    return {
      value: 100,
      selected: true,
    };
  }
}
