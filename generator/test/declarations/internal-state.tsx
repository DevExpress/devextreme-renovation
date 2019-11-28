function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export default class Component {
    @InternalState() _hovered: Boolean = false;

    updateState() {
        this._hovered = !this._hovered;
    }
}
  