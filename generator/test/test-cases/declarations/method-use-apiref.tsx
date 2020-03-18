import { Component, ComponentBindings, OneWay, Ref, Method, JSXComponent } from "../../../component_declaration/common";
import BaseWidget from "./method";

function view(viewModel: Widget) { 
    return <BaseWidget 
        ref={viewModel.baseRef} 
        prop1={viewModel.props.prop1}
    ></BaseWidget>; 
}

@ComponentBindings()
class WidgetInput { 
    @OneWay() prop1?: number;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    @Ref()
    baseRef!: BaseWidget;

    @Method()
    getSomething(): string { 
        return `${this.props.prop1} + ${this.baseRef.getHeight()}`;
    }
}
