import {
  Component,
  OneWay,
  Event,
  ComponentBindings,
  JSXComponent,
} from "../../../../component_declaration/common";

function view(model: Widget): JSX.Element {
  return <span style={model.styles}></span>;
}

type EventCallBack<Type> = (e: Type) => void;

@ComponentBindings()
export class WidgetInput {}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  get styles(): { [name: string]: string | number | undefined } {
    return { background: "green" };
  }
}
