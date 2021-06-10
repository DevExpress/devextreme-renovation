import {
  Component,
  JSXComponent,
} from "@devextreme-generator/declarations";
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
      this.props.editing.editEnabled || this.props.editing.custom?.length
    );
  }

  addChange(key: string, value: unknown) {
    const currentChanges = this.props.editing.changes
    this.props.editing.changes = {
      ...currentChanges,
      [key]: value
    };
  }

  addChangeNotDestructured(key: string, value: unknown) {
    this.props.editing.changes = {
      ...this.props.editing.changes,
      [key]: value
    };
  }

  changeDeepTwoWayProp() {
    this.props.editing.anotherCustom.twoWayProp = true;
  }
}
