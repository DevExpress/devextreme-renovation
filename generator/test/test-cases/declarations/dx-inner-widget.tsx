import { Component, ComponentBindings, JSXComponent, OneWay } from "../../../component_declaration/common";

function view(model: InnerWidget) {
    return <div></div>
}

@ComponentBindings()
export class InnerWidgetProps {
    @OneWay() value?: number;
    @OneWay() selected?: boolean;
}

@Component({
    view: view
})
export default class InnerWidget extends JSXComponent<InnerWidgetProps> {
}