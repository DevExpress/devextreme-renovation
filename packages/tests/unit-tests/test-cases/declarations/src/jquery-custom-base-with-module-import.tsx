import {
  Component,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";
import * as utils from "../../../../jquery-helpers/default_options";
import MyBaseComponent from "../../../../jquery-helpers/jquery_custom_base_component";

function view(model: Widget):JSX.Element|null {
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
export default class Widget extends JSXComponent(WidgetInput) {
  get utils() {
    utils.convertRulesToOptions([]);
    return 1;
  }
}
