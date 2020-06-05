import { JSXComponent, Component, ComponentBindings, TwoWay } from "../../../component_declaration/common";

function view() { }

@ComponentBindings()
export class WidgetProps {
    @TwoWay() p1: string = "";
    @TwoWay() p2: string = "";
 }
@Component({
    view
})
export default class Widget extends JSXComponent(WidgetProps) {
    
}
