import Base from "./empty-component"

@Component({
    viewModel: viewModel1,
    view: view1
})
export default class Component extends Base {
    @Prop size: number;
}

function viewModel1(model: Component) { 
    return {
        height: model.height
    }
}

function view1(viewModel: Component) { 
    return <div style={{ height: viewModel.height }}>
        <span></span>
        <span></span>
        <Base height={viewModel.height}></Base>
    </div>
}
