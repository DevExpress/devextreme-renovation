import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";
import MyBaseComponent from "../../../../jquery-helpers/jquery_custom_base_component";

function view(model: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}
@Component({
  view,
  jQuery: {
    register: true,
    component: MyBaseComponent,
  },
})
export default class Widget extends JSXComponent(WidgetInput) {}
