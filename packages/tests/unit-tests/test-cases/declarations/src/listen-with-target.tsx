import { Component, Listen } from "@devextreme-generator/declarations";

function view():JSX.Element|null {
  return null;
}

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
