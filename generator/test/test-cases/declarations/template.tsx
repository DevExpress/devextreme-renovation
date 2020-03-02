import { Component, Template, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

@ComponentBindings()
export class WidgetInput { 
    @Template() template?: ()=>HTMLDivElement;
    @Template() contentTemplate: (a: string) => any = (a: string) => (<div>{a}</div>);
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    
}

function view(viewModel: Widget) { 
    return (<div>
        {viewModel.props.contentTemplate("1")}
        {viewModel.props.template?.()}
    </div>)
}
