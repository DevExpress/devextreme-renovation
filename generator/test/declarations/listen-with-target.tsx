@Component({
    name: 'Component'
})
export class Component {
    @Listen('pointerup', { target: document })
    onPointerUp() { }
    
    @Listen('scroll', { target: window })
    scrollHandler() {}

    @ViewModel()
    viewModel() {}

    @View()
    view() {}
}
  