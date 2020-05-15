import { Component, Template, ComponentBindings, JSXComponent, OneWay } from "../../../component_declaration/common";

const loadingJSX = ({ text }: any) => {
    return <div>{text}</div>
}

const infoJSX = (text: string) => {
    return <span>{text}</span>
}

@ComponentBindings()
export class WidgetInput {
    @OneWay() loading: boolean = true;
    @OneWay() greetings: string = "Hello";
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    get loadingProps() {
        return { text: "Loading..." }
    }
}

function view(viewModel: Widget) { 
    const MyComponent = viewModel.props.loading ? loadingJSX(viewModel.loadingProps) : infoJSX(viewModel.props.greetings);
    return (
        <div>
            {MyComponent}
        </div>)
}
