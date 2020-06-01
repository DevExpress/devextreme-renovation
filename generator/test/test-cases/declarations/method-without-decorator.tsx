import { Component, ComponentBindings, JSXComponent, InternalState } from "../../../component_declaration/common";

function view(viewModel: Widget) {
    return <div ></div>;
}

@ComponentBindings()
class WidgetInput { }

@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {
    private privateMethod(a: number) {
    }

    method1: (a: number) => void = (a: number):void => this.privateMethod(a);

    method2: () => any = ():null => {
        return null;
    }
}
