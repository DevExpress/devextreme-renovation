import { Component, Template, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

@ComponentBindings()
export class WidgetWithTemplateInput { 
    @Template() template?: any;
    @Template() componentTemplate?: any;
}

@Component({
    view: view
})
export default class WidgetWithTemplate extends JSXComponent<WidgetWithTemplateInput> {}

function view(viewModel: WidgetWithTemplate) { 
    return (<div>
        <viewModel.props.componentTemplate />
        <viewModel.props.template />
    </div>)
}
