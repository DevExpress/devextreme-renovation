import { Component, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) {
    return <div>{model.props.pressed}</div>
}

@ComponentBindings()
class WidgetInput { 
    @TwoWay() pressed?: boolean = false;
    @TwoWay() s?: boolean;
}
@Component({
    view
})
export default class Widget extends JSXComponent<WidgetInput> {
    updateState() {
        this.props.pressed = !this.props.pressed;
    }
}
  