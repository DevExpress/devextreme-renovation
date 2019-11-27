

@Component({
    name: 'ComponentName',
    viewModel: viewModel1,
    view: view1
})
export default class Component {
    @Prop() height: number;
}

function viewModel1(model: Component) { 
    return {
        height: model.height
    }
}

function view1(viewModel) { 
    return <div style={{height: viewModel.height}}></div>
}
