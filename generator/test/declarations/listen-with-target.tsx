function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export class Component {
    @Listen('pointerup', { target: document })
    onPointerUp() { }
    
    @Listen('scroll', { target: window })
    scrollHandler() {}
}
  