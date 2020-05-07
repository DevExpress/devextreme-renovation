import { Component, ComponentBindings, JSXComponent, OneWay,TwoWay, Event } from "../../../component_declaration/common";
import InnerWidget from './dx-inner-widget';

function view({ props, restAttributes }: Widget) { 
    return <InnerWidget {...props} {...restAttributes}/>;
}

@ComponentBindings()
export class WidgetInput {
    @OneWay() visible?: boolean;
    @TwoWay() value?: boolean;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
}
