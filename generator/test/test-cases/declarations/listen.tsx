function viewModel() {}

function view() {}

@Component({
    name: 'Component',
    view,
    viewModel,
})
export class Component {
    @Listen()
    onClick(e) {}

    @Listen("pointermove")
    onPointerMove(a = "a", b = 0, c = true) {}
}
  