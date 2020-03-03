function view() { }

@Component({
    name: 'Component',
    view,
})
export class Component {
    @Listen()
    onClick(e) {}

    @Listen("pointermove")
    onPointerMove(a = "a", b = 0, c = true) {}
}
  