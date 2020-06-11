import { Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay } from "../../../../component_declaration/common";

function view(model: InnerWidget) {
    return <div style={{ width: 100, height: 100}}></div>
}

@ComponentBindings()
export class InnerWidgetProps {
    @OneWay() selected?: boolean;
    @TwoWay() value?: number;
    @Event() onSelect?: (e: any) => any;
}

@Component({
    view: view
})
export default class InnerWidget extends JSXComponent(InnerWidgetProps) {
}