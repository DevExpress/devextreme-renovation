@Component({
    name: 'Component'
})
export class Component {
    @Listen('pointerup', { target: document })
    onPointerUp() {}

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  