import { Component, ComponentBindings, JSXComponent } from "../../../component_declaration/common";
import MyBaseComponent from "../../../component_declaration/jquery_custom_base_component";

function view(model: Widget) {
    return <div></div>
}

@ComponentBindings()
class WidgetInput {
}
@Component({
    view,
    jQuery: {
        register: true,
        component: MyBaseComponent
    }
})
export default class Widget extends JSXComponent(WidgetInput) {}
  