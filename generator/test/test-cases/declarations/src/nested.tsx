import {
  Component,
  JSXComponent,
} from "../../../../component_declaration/common";
import { WidgetInput } from "./nested-props";

function view(model: Widget) {
  return <div />;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  getColumns() {
    const { columns } = this.props;

    return columns?.map((el) => (typeof el === "string" ? el : el.name));
  }

  get isEditable() {
    return (
      this.props.editing?.editEnabled || this.props.editing?.custom?.length
    );
  }
}
