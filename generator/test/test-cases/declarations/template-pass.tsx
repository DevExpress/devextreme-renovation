import { Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay } from "../../../component_declaration/common";
import WidgetWithTemplate from "./dx-widget-with-template";
import InnerWidget from './dx-inner-widget';

const CustomTemplate = ({ text }: {text: string, value: number}) => {
    return <span>{text}</span>;
}

function view(model: Widget) {
    return <WidgetWithTemplate
        template={CustomTemplate}
        componentTemplate={InnerWidget}
    />
    
}

@ComponentBindings()
export class WidgetProps {
}

@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetProps) {
}