import { Component, TwoWay } from "../../../component_declaration/common";

function viewModel() { }

function view() {}

@Component({
    view,
    viewModel
})
export default class Widget {
    @TwoWay() pressed?: boolean
    
    updateState() {
        this.pressed = !this.pressed;
    }
}
  