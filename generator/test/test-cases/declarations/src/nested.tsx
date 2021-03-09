import {
  Component,
  JSXComponent,
} from "../../../../component_declaration/common";
import { PickedProps, GridColumnProps } from "./nested-props";

export const CustomColumnComponent = (props: GridColumnProps) => {};

function view(model: Widget) {
  return <div />;
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent<PickedProps>() {
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
