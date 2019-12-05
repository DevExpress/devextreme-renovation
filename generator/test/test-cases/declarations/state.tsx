function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export default class Component {
    @State() pressed?: boolean
    
    updateState() {
        this.pressed = !this.pressed;
    }

}
  