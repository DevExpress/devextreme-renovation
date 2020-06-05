import { Component, OneWay, Event, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) {
    return <span></span>;
 }

@ComponentBindings()
class WidgetInput { 
    @OneWay() height: number = 10;
    @OneWay() width: number = 10;
}

@Component({
    view: view,
    jQuery: { register: true }
})
export default class Widget extends JSXComponent(WidgetInput) {
}
