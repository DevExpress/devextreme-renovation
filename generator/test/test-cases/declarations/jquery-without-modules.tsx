import { Component, OneWay, JSXComponent, ComponentBindings } from "../../../component_declaration/common";

@ComponentBindings()
class Props { 
    @OneWay() height?: number;
    @OneWay() width?: number;
}
@Component({
    view: view1,
    defaultOptionRules: null,
    jQuery: { register: true }
})
export default class Widget extends JSXComponent(Props) {
    
}

function view1(viewModel: Widget) { 
    return <div style={{ height: viewModel.props.height }}>
        <span></span>
        <span></span>
    </div>
}
