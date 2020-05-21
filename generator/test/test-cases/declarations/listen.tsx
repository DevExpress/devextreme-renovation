import { Component, Listen } from "../../../component_declaration/common";

function view(model: Widget) {
    return <div></div>
 }

@Component({
    name: 'Component',
    view,
})
export class Widget {
    @Listen()
    onClick(e) {}

    @Listen("pointermove")
    onPointerMove(a = "a", b = 0, c = true) {}
}
  