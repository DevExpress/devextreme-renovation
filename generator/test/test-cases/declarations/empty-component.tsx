
@Component({
    name: 'ComponentName',
    viewModel: viewModel1,
    view: view1
})
export default class Component {
    @OneWay() height: number;
    @OneWay() width: number;
}

function viewModel1(model: Component) { 
    return {
        height: model.height
    }
}

function view1(viewModel) { 
    return <div style={{ height: viewModel.height }}>
        <span></span>
        <span></span>
    </div>
}
