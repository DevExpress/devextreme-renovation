import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";
import WidgetWithProps from "./props";

function view(model: Widget) {
  return <WidgetWithProps {...model.restAttributes} />;
}

@ComponentBindings()
export class WidgetInput {
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
}
