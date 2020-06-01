import { Component, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) {
    return <div>{model.props.state1}</div>
}

@ComponentBindings()
class WidgetInput { 
    @TwoWay() state1?: boolean;
    @TwoWay() state2?: string;
}
@Component({
    view,
    jQuery: { register: true }
})
export default class Widget extends JSXComponent(WidgetInput) {}
  