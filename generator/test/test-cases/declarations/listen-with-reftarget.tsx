function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel
})
export class Component {
    @Ref() divRef!: HTMLDivElement;

    @Listen('pointerup', { refTarget: 'divRef' })
    onPointerUp() { }
}
  