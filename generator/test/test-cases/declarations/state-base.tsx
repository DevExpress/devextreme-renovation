import { Component, Event, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: StateBaseWidget) {
    return <div>{model.props.baseStateProp}</div>
}

@ComponentBindings()
class StateBaseWidgetInput { 
    @TwoWay() baseStateProp?: boolean = false;
    @Event() baseStatePropChange?: (stateProp: boolean) => void;
}
@Component({
    view
})
export default class StateBaseWidget extends JSXComponent<StateBaseWidgetInput> {
    
}
  