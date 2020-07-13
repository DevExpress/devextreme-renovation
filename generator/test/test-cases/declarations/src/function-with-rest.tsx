import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../../component_declaration/common";

const someFunction = (arg1: number, arg2: string, ...args: object[]) => {};

@ComponentBindings()
export class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  someMethod(...args: object[]) {}
}

function view(viewModel: Widget) {
  return <div></div>;
}
