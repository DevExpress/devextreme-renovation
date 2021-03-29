import {
  JSXComponent,
  Component,
  ComponentBindings,
  TwoWay,
} from "@devextreme-generator/declarations";

function view() {}

@ComponentBindings()
export class WidgetProps {
  @TwoWay() p1: string = "";
  @TwoWay() p2: string = "";
}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
