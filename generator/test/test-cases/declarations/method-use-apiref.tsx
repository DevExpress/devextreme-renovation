import { Component, ComponentBindings, OneWay, Ref, Method, JSXComponent } from "../../../component_declaration/common";
import BaseWidget from "./method";

function view(viewModel: WidgetWithApiRef) { 
    return <BaseWidget 
        ref={viewModel.baseRef as any} 
        prop1={viewModel.props.prop1}
    ></BaseWidget>; 
}

@ComponentBindings()
class WidgetWithApiRefInput { 
    @OneWay() prop1?: number;
}

@Component({
    view: view
})
export default class WidgetWithApiRef extends JSXComponent(WidgetWithApiRefInput) {
    @Ref()
    baseRef?: BaseWidget;

    @Method()
    getSomething(): string { 
        return `${this.props.prop1} + ${this.baseRef?.getHeight(1, undefined)}`;
    }
}
