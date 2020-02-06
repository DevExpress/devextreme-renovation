import { OneWay, Listen, JSXComponent, Component, ComponentBindings } from "../../../component_declaration/common";

function view() { }
function viewModel() { }

@ComponentBindings()
export class WidgetProps { 
    @OneWay() height?: number = 10;
}

@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget extends JSXComponent<WidgetProps> {
    @Listen("click")
    onClick() { 
        const v = this.props.height;
    }
}
