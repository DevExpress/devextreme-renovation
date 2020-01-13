function view(viewModel) {
    return (
        <div>
            <div>
                {viewModel.drawer}
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
export default class Component {
    @Slot() namedSlot: any;
    @Slot() default: any;
}
