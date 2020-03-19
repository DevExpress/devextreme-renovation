import { JSXComponent, Component, ComponentBindings } from "../../../component_declaration/common";

function view() { }

@ComponentBindings()
export class WidgetProps { }
@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetProps> {
    
}
