import { Component, OneWay, Event, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) { }

@ComponentBindings()
class WidgetInput {
    @OneWay() size?: {
        width: number,
        height: number
    } = {width: 10, height: 20};
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<Required<WidgetInput>> {
    get getHeight(): number { 
        return this.props.size.height;
    }
}
