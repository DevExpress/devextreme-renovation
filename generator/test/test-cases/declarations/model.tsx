import { Component, Event, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: ModelWidget) {
    return <div>{model.props.baseStateProp}</div>
}

@ComponentBindings()
class ModelWidgetInput { 
    @TwoWay() baseStateProp?: boolean;
    @Event() baseStatePropChange?: (stateProp: boolean) => void;
    
    @TwoWay({ isModel: true }) modelStateProp?: boolean;
    @TwoWay() value?: boolean;
}
@Component({
    view
})
export default class ModelWidget extends JSXComponent(ModelWidgetInput) {
    
}
  