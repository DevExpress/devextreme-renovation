import { OneWay, Listen, JSXComponent, Component, ComponentBindings } from "../../../component_declaration/common";

function view() { }
function viewModel() { }

@ComponentBindings()
export class WidgetProps { }
@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget extends JSXComponent<WidgetProps> {
    
}
