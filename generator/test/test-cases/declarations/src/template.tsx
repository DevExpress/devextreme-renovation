import { Component, Template, ComponentBindings, JSXComponent } from "../../../../component_declaration/common";


@ComponentBindings()
export class WidgetInput { 
    @Template() headerTemplate?: any;
    @Template() template: (props: { textProp: string, textPropExpr: string }) => any = () => <div></div>;
    @Template() contentTemplate: (props: { data: { p1: string }, index: number }) => any = (props) => (<div>{props.data.p1}</div>);
    @Template() footerTemplate: (props: { someProp: boolean }) => any = () => <div></div>;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {}

function view(viewModel: Widget) {
    return (<div>
        <viewModel.props.headerTemplate />
        {viewModel.props.contentTemplate && <viewModel.props.contentTemplate data={{p1: "value"}} index={10} />}
        {!viewModel.props.contentTemplate && <viewModel.props.template textProp="textPropValue" textPropExpr={"textPropExrpValue"} />}
        <viewModel.props.footerTemplate someProp={true} ></viewModel.props.footerTemplate>
    </div>)
}
