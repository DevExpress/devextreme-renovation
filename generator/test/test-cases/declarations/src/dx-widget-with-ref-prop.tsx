import { Component, Ref, ComponentBindings, JSXComponent } from "../../../../component_declaration/common";

@ComponentBindings()
export class WidgetWithRefPropInput { 
    @Ref() parentRef?: any;
    @Ref() nullableRef?: any;
}

@Component({
    view: view
})
export default class WidgetWithRefProp extends JSXComponent(WidgetWithRefPropInput) {}

function view(viewModel: WidgetWithRefProp) { 
    return (<div></div>)
}
