import { Component, Template, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

@ComponentBindings()
export class WidgetInput { 
    @Template() template: () => any = () => <div></div>;
    @Template() contentTemplate: (data: {p1: string }) => any = (data) => (<div>{data.p1}</div>);
}

@Component({
    view: view,
    registerJQuery: true
})
export default class Widget extends JSXComponent<WidgetInput> {}

function view(viewModel: Widget) { 
    return (<div>
        <viewModel.props.contentTemplate p1={"value"}/>
        <viewModel.props.template />
    </div>)
}
