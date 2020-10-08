import {
  Component,
  ComponentBindings,
  OneWay,
  Method,
  JSXComponent,
} from "../../../../component_declaration/common";

function view(model: Widget) {
  return <div></div>;
}

@ComponentBindings()
class WidgetInput {}

@Component({
  view,
  jQuery: { register: true },
})
export default class Widget extends JSXComponent(WidgetInput) {
  @Method() methodWithElementParam(
    arg1: number,
    elementArg: HTMLElement | string
  ): number {
    return arg1;
  }

  @Method() methodWithElementReturn(
    arg1: number,
    elementArg: HTMLElement
  ): HTMLElement {
    return elementArg;
  }
}
