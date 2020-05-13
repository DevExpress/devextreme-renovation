import { Component, Event, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: StateBaseWidget) {
    return <div>{model.props.stateProp}</div>
}

@ComponentBindings()
class StateBaseWidgetInput { 
    @TwoWay() stateProp?: boolean = false;
    @Event() statePropChange?: (stateProp: boolean) => void;
}
@Component({
    view
})
export default class StateBaseWidget extends JSXComponent<StateBaseWidgetInput> {
    
}
  