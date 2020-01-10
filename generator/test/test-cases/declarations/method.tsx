function view() { }
function viewModel() { }
@Component({
    viewModel: viewModel,
    view: view
})
export default class Component {
    @Method()
    getHeight(): string { 
        return "";
    }
}
