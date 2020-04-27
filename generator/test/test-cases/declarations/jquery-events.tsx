import { Component, Event, ComponentBindings, JSXComponent } from "../../../component_declaration/common";


@ComponentBindings()
class WidgetProps { 
    @Event() onKeyDown?: (e: any) => any;
}

@Component({ 
    view: () => (null),
    registerJQuery: true
})
export default class Widget extends JSXComponent<WidgetProps> {
}
