function view() { }
function viewModel() { }

function subscribe() {
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
    @Effect()
    setupData() {
        const id = subscribe();
        return () => unsubscribe(id);
    }
}
