
function view() { }
function viewModel() { }

@Component({
    viewModel: viewModel,
    view: view
})
export default class Component {
    @Template() template: any;
    @Template() contentTemplate: any
}
