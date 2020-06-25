import { Component, OneWay, Event, ComponentBindings, JSXComponent, TwoWay, Slot, Template, Ref, Method } from "../../../../component_declaration/common";
import AnotherWidget from "./method";

function view(model: MetaWidget) { return null; }

@ComponentBindings()
class MetaWidgetInput { 
    @OneWay() oneWayProp1?: any;
    @OneWay() oneWayProp2?: any;
    @TwoWay() twoWayProp1?: any;
    @TwoWay() twoWayProp2?: any;
    @Slot() slotProp1?: any;
    @Slot() slotProp2?: any;
    @Template() templateProp1?: any;
    @Template() templateProp2?: any;
    @Event() eventProp1?: any;
    @Event() eventProp2?: any;
    @Ref() refProp1?: any;
    @Ref() refProp2?: any;
}

@Component({
    view: view,
    jQuery: {
        register: true
    }
})
export default class MetaWidget extends JSXComponent(MetaWidgetInput) {
    @Ref()
    baseRef?: AnotherWidget;

    @Method()
    apiMethod1() { return this.baseRef?.getHeight(1, 1); }

    @Method()
    apiMethod2() { return this.baseRef?.getHeight(1, 1); }
}
