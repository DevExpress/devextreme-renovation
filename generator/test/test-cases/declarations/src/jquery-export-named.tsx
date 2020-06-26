import { Component, OneWay, ComponentBindings, JSXComponent } from "../../../../component_declaration/common";

function view(model: Widget) {
    return <div></div>
}

@ComponentBindings()
class WidgetInput { 
    @OneWay() prop?: boolean;
}
@Component({
    view,
    jQuery: {
        register: true
    }
})
export class Widget extends JSXComponent(WidgetInput) {}
  