import { PickedProps, GridColumnProps } from "./nested-props";
export const CustomColumnComponent = (props: typeof GridColumnProps) => {};
function view(model: Widget) {
  return <div />;
}

import * as Preact from "preact";
import { useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof PickedProps & RestProps;
  getColumns: () => any;
  isEditable: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof PickedProps & RestProps) {
  const __getColumns = useCallback(
    function __getColumns(): any {
      const { columns } = props;
      return columns?.map((el) => (typeof el === "string" ? el : el.name));
    },
    [props.columns]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return props.editing.editEnabled || props.editing.custom?.length;
    },
    [props.editing]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { columns, editing, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getColumns: __getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = PickedProps;
