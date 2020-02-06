import { OneWay, TwoWay, Component, InternalState, Effect } from "../../../component_declaration/common";

function view() { }
function viewModel() { }

function subscribe(p: string, s: number, i: number) {
    return 1;
}

function unsubscribe(id: number) {
    return undefined;
}

@Component({
    viewModel: viewModel,
    view: view
})
export default class Widget {
    @OneWay() p: string = "10";
    @TwoWay() s: number;
    @InternalState() i: number;
    @Effect()
    setupData() {
        const id = subscribe(this.p, this.s, this.i);
        return () => unsubscribe(id);
    }
}
