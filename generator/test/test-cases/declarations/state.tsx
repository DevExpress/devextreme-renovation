import { Component, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";
import BaseState from "./model";

function view(model: Widget) {
    return (<div>
        {model.props.state1}
        <BaseState baseStatePropChange={model.stateChange}></BaseState>
    </div>);
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
export default class Widget extends JSXComponent(WidgetInput) {
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

    stateChange(stateProp: boolean) {
        this.props.stateProp = stateProp;
    }
}
  