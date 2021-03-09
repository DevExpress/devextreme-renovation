import { Component, Listen } from "@devextreme-generator/declaration";

function view(model: Widget) {
  return <div></div>;
}

@Component({
  name: "Component",
  view,
})
export class Widget {
  @Listen()
  onClick(e: Event) {}

  @Listen("pointermove")
  onPointerMove(a = "a", b = 0, c = true) {}
}
