import { Prop, Listen, JSXComponent, Component, ComponentInput } from "../../../component_declaration/common";

function view() { }
function viewModel() { }

@ComponentInput()
export class WidgetProps { 
    @Prop() height?: number = 10;
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
