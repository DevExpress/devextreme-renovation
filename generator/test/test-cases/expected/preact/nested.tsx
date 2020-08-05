import { WidgetInput } from "./nested-props";
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
  props: typeof WidgetInput & RestProps;
  getColumns: () => any;
  isEditable: any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const getColumns = useCallback(
    function getColumns(): any {
      const { columns } = props;
      return columns?.map((el) => (typeof el === "string" ? el : el.name));
    },
    [props.columns]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return (
        props.gridEditing?.editEnabled || props.gridEditing?.custom?.length
      );
    },
    [props.gridEditing]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { columns, gridEditing, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
