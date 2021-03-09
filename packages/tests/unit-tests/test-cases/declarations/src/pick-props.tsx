import {
  JSXComponent,
  Component,
} from "../../../../component_declaration/common";
import Props from "./component-bindings-only";
import { Options } from "./types";

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
