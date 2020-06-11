import { Component, ComponentBindings, JSXComponent, OneWay, Fragment } from "../../component_declaration/common";

function view(model: ComponentWithRest) {
    return (
        <div {...model.restAttributes}></div>
    );
}

@ComponentBindings()
class WidgetInput {
    @OneWay() containerId: string = "default";
}

@Component({
    view
})

export default class ComponentWithRest extends JSXComponent(WidgetInput) {}
