declare type Column = { name: string; index?: number };
declare type Editing = { editEnabled?: boolean };
declare type Custom = {};
function view(model: Widget) {
  return <div />;
}

export declare type WidgetInputType = {
  columns?: Array<Column | string>;
  gridEditing?: Editing;
  someArray?: Array<Custom>;
};
const WidgetInput: WidgetInputType = {};

import * as Preact from "preact";
import { useCallback } from "preact/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  [x: string]: any;
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
      return props.columns?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
    [props.columns]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return props.gridEditing?.editEnabled;
    },
    [props.gridEditing]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { columns, gridEditing, someArray, ...restProps } = {
        columns: props.columns,
        gridEditing: props.gridEditing,
        someArray: props.someArray,
      };
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

(Widget as any).defaultProps = {
  ...WidgetInput,
};
