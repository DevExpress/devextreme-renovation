import { Component, JSXComponent } from "@devextreme-generator/declarations";
import Button, { ButtonInput } from "./button";

function view(model: Widget) {
  return <Button {...(model.props as ButtonInput)} />;
}

@Component({
  view,
  jQuery: {register: true},
})
export default class Widget extends JSXComponent(ButtonInput) {}
