import { Component, ComponentBindings, Slot, JSXComponent } from "../../../../component_declaration/common";

function view(viewModel: Widget) {
    return (
        <div>
            <div>
                {viewModel.props.namedSlot}
            </div>
            <div>
                {viewModel.props.children}
            </div>
        </div>
    );
}

@ComponentBindings()
class WidgetInput { 
    @Slot() namedSlot?: any;
    @Slot() children?: any;
}
@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {}
