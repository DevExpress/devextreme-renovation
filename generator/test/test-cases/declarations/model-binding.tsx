import { Component, Event, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: ModelBindingWidget) {
    return <div>{model.props.baseStateProp}</div>
}

@ComponentBindings()
class ModelBindingWidgetInput { 
    @TwoWay() baseStateProp?: boolean;
    @Event() baseStatePropChange?: (stateProp: boolean) => void;

    @TwoWay({ isModel: true }) modelStateProp?: boolean;
}
@Component({
    view
})
export default class ModelBindingWidget extends JSXComponent<ModelBindingWidgetInput> {
    
}
  