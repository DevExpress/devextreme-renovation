import { Component, OneWay, ComponentBindings, InternalState, JSXComponent } from "../../../../component_declaration/common";

function view(viewModel: Widget) { 
    return <div></div>
}

@ComponentBindings()
export class Props{
    @OneWay() p: number = 10;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent(Props) {
    @InternalState() i: number = 10;

    get g1(): number[]{
        return [this.props.p, this.i];
    }

    get g2(): number{
        return this.props.p;
    }
}
