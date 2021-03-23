import {
  JSXComponent,
  Component,
} from "@devextreme-generator/declarations";
import Props from "./component-bindings-only";

function view(model: Widget) {
  return <div>{model.props.height}</div>;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(Props) {}
