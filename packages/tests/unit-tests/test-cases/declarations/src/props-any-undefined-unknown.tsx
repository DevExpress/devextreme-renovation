import {
  Component,
  OneWay,
  ComponentBindings,
  JSXComponent,
} from "@devextreme-generator/declarations";

function view(model: Widget): JSX.Element {
  return (<div></div>);
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() anyProp: any;
  @OneWay() undefinedProp: undefined;
  @OneWay() unknownProp: unknown;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {}
