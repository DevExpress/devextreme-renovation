import { Component, ComponentBindings, Slot, JSXComponent } from "../../../component_declaration/common";

function view(viewModel: Widget) {
    return (
        <div>
            <div>
                {viewModel.props.namedSlot}
            </div>
            <div>
                {viewModel.props.default}
            </div>
        </div>
    );
}

@ComponentBindings()
class WidgetInput { 
    @Slot() namedSlot?: any;
    @Slot() default?: any;
}
@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {}
