import { Component, Event, ComponentBindings, JSXComponent } from "../../../../component_declaration/common";


@ComponentBindings()
class WidgetProps { 
    @Event() onKeyDown?: (e: any) => any;
    @Event({ }) onEventWithoutConfig?: (e: any) => any;
    @Event({ actionConfig: { someAction: "config" } }) onEventWithConfig?: (e: any) => any;
    @Event({ actionConfig: {} }) onEventWithEmptyConfig?: (e: any) => any;
}

@Component({ 
    view: () => (null),
    jQuery: { register: true }
})
export default class Widget extends JSXComponent(WidgetProps) {
}
