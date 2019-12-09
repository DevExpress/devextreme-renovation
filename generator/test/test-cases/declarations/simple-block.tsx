function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export class Component {
    method(a: number): number { 
        return 10 + a;
    }
}
  