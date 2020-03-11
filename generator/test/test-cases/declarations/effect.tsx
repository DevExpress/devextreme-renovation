import { OneWay, TwoWay, Component, InternalState, Effect, ComponentBindings, JSXComponent } from "../../../component_declaration/common";

function view() { }

function subscribe(p: string, s: number, i: number) {
    return 1;
}

function unsubscribe(id: number) {
    return undefined;
}

@ComponentBindings()
export class WidgetInput { 
    @OneWay() p: string = "10";
    @TwoWay() s: number;
    @InternalState() i: number;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    @Effect()
    setupData() {
        const id = subscribe(this.p, this.s, this.i);
        this.i = 15;
        return () => unsubscribe(id);
    }
}
