import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
import { PickedProps, GridColumnProps } from "./nested-props";
export const CustomColumnComponent = (props: typeof GridColumnProps) => {};
function view(model: Widget) {
  return <div />;
}

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.getColumns = this.getColumns.bind(this);
  }

  getColumns(): any {
    const { columns } = this.props as any;
    return columns?.map((el) => (typeof el === "string" ? el : el.name));
  }
  get isEditable(): any {
    return this.props.editing.editEnabled || this.props.editing.custom?.length;
  }
  get restAttributes(): RestProps {
    const { columns, editing, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      getColumns: this.getColumns,
      isEditable: this.isEditable,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = PickedProps;
