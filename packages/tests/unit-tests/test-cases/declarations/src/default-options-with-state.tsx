import {
  JSXComponent,
  Component,
  ComponentBindings,
  TwoWay,
} from "@devextreme-generator/declarations";

function view(): JSX.Element|null {
  return null;
}

@ComponentBindings()
export class WidgetProps {
  @TwoWay() p1: string = "";
  @TwoWay() p2: string = "";
}
@Component({
  view,
})
export default class Widget extends JSXComponent(WidgetProps) {}
