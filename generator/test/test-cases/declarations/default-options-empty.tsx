import { JSXComponent, Component, ComponentBindings } from "../../../component_declaration/common";
import "typescript";

function view() { }

@ComponentBindings()
export class WidgetProps { }
@Component({
    view: view,
    defaultOptionRules: [{
        device: true,
        options: {}
    }]
})
export default class Widget extends JSXComponent(WidgetProps) {
    
}
