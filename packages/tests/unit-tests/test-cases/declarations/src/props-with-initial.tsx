import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "../../../../component_declaration/common";
import { WidgetWithProps } from "./dx-widget-with-props";

function view(model: Widget): JSX.Element {
  return <WidgetWithProps />;
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view: view,
})
export class Widget extends JSXComponent(WidgetInput) {}
