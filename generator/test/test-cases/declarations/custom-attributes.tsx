import { OneWay, Component, ComponentBindings, JSXComponent, TwoWay } from "../../../component_declaration/common";

function view(model: Widget) { 
    return <div></div>;
}

@ComponentBindings()
export class WidgetInput {
    @OneWay() prop1?: any;
    @TwoWay() stateProp?: any;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> { 
}
