import { Component, OneWay, TwoWay, ComponentBindings, JSXComponent } from "../../../../component_declaration/common";

function view(model: Widget) {
    return <span></span>;
 }

@ComponentBindings()
class WidgetInput { 
    @OneWay() height: number = 10;
    @TwoWay() selected: boolean = false;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {
    getProps(): any {
        return this.props;
    }
}
