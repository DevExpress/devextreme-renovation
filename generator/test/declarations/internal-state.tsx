@Component({
    name: 'Component'
})
export class Component {
    @InternalState() hovered: Boolean = false;

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  