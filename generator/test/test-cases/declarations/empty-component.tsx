import { Component, OneWay } from "../../../component_declaration/common";
@Component({
    viewModel: viewModel1,
    view: view1,
    defaultOptionRules: null,
    registerJQuery: true
})
export default class Widget {
    @OneWay() height: number;
    @OneWay() width: number;
}

function viewModel1(model: Widget) { 
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
