import { Component, OneWay, Event, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) { }

@ComponentBindings()
class WidgetInput { 
    @OneWay() height: number = 10;
    @Event() onClick: (a:number) => null = () => null;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    getHeight():number { 
        this.props.onClick(10);
        return this.props.height;
    }
}
