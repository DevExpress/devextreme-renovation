import { Component, State } from "../../../component_declaration/common";

function viewModel() { }

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export default class Widget {
    @State() pressed?: boolean
    
    updateState() {
        this.pressed = !this.pressed;
    }

}
  