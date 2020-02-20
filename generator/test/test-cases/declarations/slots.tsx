import { Component, Slot } from "../../../component_declaration/common";

function view(viewModel) {
    return (
        <div>
            <div>
                {viewModel.namedSlot}
            </div>
            <div>
                {viewModel.default}
            </div>
        </div>
    );
}
function viewModel() { }
@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget {
    @Slot() namedSlot?: any;
    @Slot() default?: any;
}
