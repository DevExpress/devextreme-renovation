@Component({
    name: 'Component'
})
export default class Component {
    @InternalState() _hovered: Boolean = false;

    updateState() {
        this._hovered = !this._hovered;
    }

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  