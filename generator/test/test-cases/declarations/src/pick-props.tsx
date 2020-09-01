import {
  JSXComponent,
  Component,
} from "../../../../component_declaration/common";
import Props, { Options } from "./component-bindings-only";

function view(model: Widget) {
  return <div>{model.props.data?.value}</div>;
}

type WidgetProps = Pick<Props, "data" | "info">;

@Component({
  view: view,
})
export default class Widget extends JSXComponent<WidgetProps>() {
  innerData: Options = { value: "" };
}
