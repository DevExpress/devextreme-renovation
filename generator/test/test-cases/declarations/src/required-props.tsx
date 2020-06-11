import { Component, OneWay, ComponentBindings, JSXComponent } from "../../../../component_declaration/common";

function view() { }

@ComponentBindings()
class WidgetInput {
    @OneWay() size?: {
        width: number,
        height: number
    } = { width: 10, height: 20 };
    
    @OneWay() type?: string = "type"
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<Required<WidgetInput>, WidgetInput>(WidgetInput) {
    get getHeight(): number { 
        return this.props.size.height;
    }

    get type(): string { 
        const { type } = this.props;
        return type;
    }
}
