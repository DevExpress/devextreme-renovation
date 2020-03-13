import { OneWay, TwoWay, Component, InternalState, Effect, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view(model: Widget) { }

function subscribe(p: string, s: number, i: number) {
    return 1;
}

function unsubscribe(id: number) {
    return undefined;
}

@ComponentBindings()
export class WidgetInput { 
    @OneWay() p: string = "10";
    @TwoWay() s: number = 10;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    @InternalState() i: number = 10;
    @Effect()
    setupData() {
        const id = subscribe(this.props.p, this.props.s, this.i);
        this.i = 15;
        return () => unsubscribe(id);
    }
}
