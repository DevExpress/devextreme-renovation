import { Component, OneWay, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Simple) { 
    return <div id="simple" style={{ 
        backgroundColor: model.props.color,
        width: model.props.width,
        height: model.props.height,
    }}></div>;
}

@ComponentBindings()
class WidgetInput { 
    @OneWay() height: number = 10;
    @OneWay() width: number = 10;
    @OneWay() color?: string = "red"
}

@Component({
    view
})

export default class Simple extends JSXComponent(WidgetInput) {}
