import Base from "./empty-component"
import { OneWay, Component } from "../../../component_declaration/common";

@Component({
    viewModel: viewModel1,
    view: view1
})
export default class Widget extends Base {
    @OneWay() size: number;
}

function viewModel1(model: Widget) { 
    return {
        height: model.height
    }
}

function view1(viewModel: Widget) { 
    return <div style={{ height: viewModel.height }}>
        <span></span>
        <span></span>
        <Base height={viewModel.height}></Base>
    </div>
}
