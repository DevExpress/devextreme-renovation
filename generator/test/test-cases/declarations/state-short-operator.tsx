import { Component, TwoWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) {
    return (<div></div>);
}

@ComponentBindings()
class WidgetInput { 
    @TwoWay() propState: number = 1;
}
@Component({
    view
})
export default class Widget extends JSXComponent(WidgetInput) {
    innerState = 0;
    
    updateState() {
        ++this.innerState;
        this.innerState++;
        this.innerState += 1;
        this.innerState = this.innerState + 1;
        ++this.props.propState ;
        this.props.propState ++;
        this.props.propState += 1;
        this.props.propState = this.props.propState + 1;
    }
}
  