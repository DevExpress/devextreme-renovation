import { Component, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) {
    return <div>{model.props.state1}</div>
}

@ComponentBindings()
class WidgetInput { 
    @TwoWay() state1?: boolean = false;
    @TwoWay() state2: boolean = false;
    @TwoWay() stateProp?: boolean;
}
@Component({
    view
})
export default class Widget extends JSXComponent<WidgetInput> {
    updateState() {
        this.props.state1 = !this.props.state1;
    }

    updateState2() {
        const cur = this.props.state2;
        this.props.state2 = cur !== false ? false : true;
    }

    destruct() { 
        const { state1 } = this.props;
        const s = state1;
    }
}
  