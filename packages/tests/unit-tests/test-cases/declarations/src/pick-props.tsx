import {
  JSXComponent,
  Component,
} from "@devextreme-generator/declarations";
import Props from "./component-bindings-only";
import { Options } from "./types.d";

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
