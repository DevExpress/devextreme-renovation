@Component({
    name: 'Component'
})
export class Component {
    method(a: number): number { 
        return 10 + a;
    }

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  