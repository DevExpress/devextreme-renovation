@Component({
    name: 'Component'
})
export class Component {
    @State() pressed: Boolean
    
    updateState() {
        this.pressed = !this.pressed;
    }

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  