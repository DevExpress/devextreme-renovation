import { Component, OneWay, Event, ComponentBindings, JSXComponent } from "../../../component_declaration/common";
import Base, { WidgetProps } from "./component-input";

function view(model: Widget) { 
    <Base height={model.getProps().height}/>
}

@ComponentBindings()
class ChildInput extends WidgetProps { 
    @OneWay() height: number = 10;
    @Event() onClick: (a:number) => null = () => null;
}

@Component({ view })
export default class Widget extends JSXComponent<ChildInput> {
    getProps(): WidgetProps { 
        return this.props;
    }
}
