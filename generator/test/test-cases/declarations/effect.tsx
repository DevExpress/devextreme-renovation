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
export default class Component {
    @Prop() p: string = "10";
    @State() s: number
    @InternalState() i: number;
    @Effect()
    setupData() {
        const id = subscribe(this.p, this.s, this.i);
        return () => unsubscribe(id);
    }
}
