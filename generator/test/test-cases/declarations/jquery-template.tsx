import { Component, Template, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

@ComponentBindings()
export class WidgetInput { 
    @Template() template: () => any = () => <div></div>;
    @Template({}) anotherTemplate: () => any = () => <div></div>;
    @Template({ canBeAnonymous: false }) containerTemplate: () => any = () => <div></div>;
    @Template({ canBeAnonymous: true }) contentTemplate: () => any = () => <div></div>;
}

@Component({
    view: view,
    jQuery: { register: true }
})
export default class Widget extends JSXComponent<WidgetInput> {}

function view(viewModel: Widget) { 
    return (<div>
        <viewModel.props.template />
        <viewModel.props.anotherTemplate />
        <viewModel.props.containerTemplate />
        <viewModel.props.contentTemplate />
    </div>)
}
