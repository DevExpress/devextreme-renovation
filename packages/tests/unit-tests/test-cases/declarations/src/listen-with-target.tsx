import { Component, Listen } from "@devextreme-generator/declaration";

function view() {}

@Component({
  name: "Component",
  view,
})
export class Widget {
  @Listen("pointerup", { target: document })
  onPointerUp() {}

  @Listen("scroll", { target: window })
  scrollHandler() {}
}
