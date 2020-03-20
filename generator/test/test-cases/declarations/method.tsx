import { Component, ComponentBindings, OneWay, Ref, Method, JSXComponent } from "../../../component_declaration/common";

function view(viewModel: Widget) { return (<div ref={viewModel.divRef as any}></div>); }

@ComponentBindings()
class WidgetInput { 
    @OneWay() prop1?: number;
    @OneWay() prop2?: number;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    @Ref() divRef!: HTMLDivElement;

    @Method()
    getHeight(): string { 
        return `${this.props.prop1} + ${this.props.prop2} + ${this.divRef.innerHTML}`;
    }

    @Method()
    getSize(): string { 
        return `${this.props.prop1} + ${this.divRef.innerHTML}`;
    }
}
