import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";
import { JQueryCustomBaseComponent } from "../../../../jquery-helpers/jquery_custom_base_component";

function view(model: Widget):JSX.Element|null {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}
@Component({
  view,
  jQuery: {
    register: true,
    component: JQueryCustomBaseComponent,
  },
})
export default class Widget extends JSXComponent(WidgetInput) {}
