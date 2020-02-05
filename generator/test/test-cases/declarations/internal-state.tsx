import { Component, InternalState} from "../../../component_declaration/common";

function viewModel() { }

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export default class Widget {
    @InternalState() _hovered: Boolean = false;

    updateState() {
        this._hovered = !this._hovered;
    }
}
  