import {
  JSXComponent,
  Component,
} from "../../../../component_declaration/common";
import Props from "./component-bindings-only";

function view(model: Widget) {
  return <div>{model.props.height}</div>;
}

type WidgetProps = Pick<Props, "height">;

@Component({
  view: view,
})
export default class Widget extends JSXComponent<WidgetProps>() {}
