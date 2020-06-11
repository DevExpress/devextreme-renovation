import { OneWay, JSXComponent, Component, ComponentBindings, Slot } from "../../../../component_declaration/common";

export const COMPONENT_INPUT_CLASS = "c3";

function view(model: Widget) {
    return <div></div>
 }

@ComponentBindings()
export class WidgetProps { 
    @OneWay() height?: number = 10;
    @OneWay() width?: number = 10;
    @Slot() children?: any;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetProps) {
    onClick() { 
        const v = this.props.height;
    }
}
