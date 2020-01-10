@Component({
    viewModel: viewModel,
    view: view
})
export default class Component {
    @Template() template: ()=>HTMLDivElement;
    @Template() contentTemplate: (a: string) => HTMLDivElement = (a: string) => (<div>{a}</div>);
}

function viewModel(model: Component) {
    return model;
 }


function view(viewModel: Component) { 
    return (<div>
        {viewModel.contentTemplate("1")}
        {viewModel.template()}
    </div>)
}
