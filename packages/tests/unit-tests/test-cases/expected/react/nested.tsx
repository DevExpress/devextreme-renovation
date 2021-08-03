import { PickedProps, GridColumnProps } from "./nested-props";
export const CustomColumnComponent = (props: typeof GridColumnProps) => {};
function view(model: Widget) {
  return <div />;
}

import * as React from "react";
import { useCallback } from "react";

function __collectChildren(children: React.ReactNode): Record<string, any> {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).reduce((acc: Record<string, any>, child) => {
    const {
      children: childChildren,
      __defaultNestedValues,
      ...childProps
    } = child.props;
    const collectedChildren = __collectChildren(childChildren);
    const childPropsValue = Object.keys(childProps).length
      ? childProps
      : __defaultNestedValues;
    const allChild = { ...childPropsValue, ...collectedChildren };
    return {
      ...acc,
      [child.type.propName]: acc[child.type.propName]
        ? [...acc[child.type.propName], allChild]
        : [allChild],
    };
  }, {});
}
import {
  EditingProps,
  CustomProps,
  ColumnEditingProps,
  AnotherCustomProps,
} from "./nested-props";
export const Column: React.FunctionComponent<typeof GridColumnProps> & {
  propName: string;
} = () => null;
Column.propName = "columns";
Column.defaultProps = GridColumnProps;
export const Editing: React.FunctionComponent<typeof EditingProps> & {
  propName: string;
} = () => null;
Editing.propName = "editing";
Editing.defaultProps = EditingProps;
export const ColumnCustom: React.FunctionComponent<typeof CustomProps> & {
  propName: string;
} = () => null;
ColumnCustom.propName = "custom";
ColumnCustom.defaultProps = CustomProps;
export const ColumnEditing: React.FunctionComponent<
  typeof ColumnEditingProps
> & { propName: string } = () => null;
ColumnEditing.propName = "editing";
ColumnEditing.defaultProps = ColumnEditingProps;
export const EditingCustom: React.FunctionComponent<typeof CustomProps> & {
  propName: string;
} = () => null;
EditingCustom.propName = "custom";
EditingCustom.defaultProps = CustomProps;
export const EditingAnotherCustom: React.FunctionComponent<
  typeof AnotherCustomProps
> & { propName: string } = () => null;
EditingAnotherCustom.propName = "anotherCustom";
EditingAnotherCustom.defaultProps = AnotherCustomProps;

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
  nestedChildren: () => Record<string, any>;
  __getNestedColumns: Array<typeof GridColumnProps | string> | undefined;
  __getNestedEditing: typeof EditingProps;
}

export default function Widget(props: typeof PickedProps & RestProps) {
  const __getColumns = useCallback(
    function __getColumns(): any {
      return __getNestedColumns()?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
    [props.columns, props.children]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return (
        __getNestedEditing().editEnabled || __getNestedEditing().custom?.length
      );
    },
    [props.editing, props.children]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        children,
        columns,
        editing,
        ...restProps
      } = {
        ...props,
        columns: __getNestedColumns(),
        editing: __getNestedEditing(),
      };
      return restProps;
    },
    [props]
  );
  const __nestedChildren = useCallback(
    function __nestedChildren(): Record<string, any> {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedColumns = useCallback(
    function __getNestedColumns():
      | Array<typeof GridColumnProps | string>
      | undefined {
      const nested = __nestedChildren();
      return props.columns
        ? props.columns
        : nested.columns
        ? nested.columns
        : undefined;
    },
    [props.columns, props.children]
  );
  const __getNestedEditing = useCallback(
    function __getNestedEditing(): typeof EditingProps {
      const nested = __nestedChildren();
      return props.editing
        ? props.editing
        : nested.editing
        ? nested.editing?.[0]
        : props?.__defaultNestedValues?.editing;
    },
    [props.editing, props.children]
  );

  return view({
    props: {
      ...props,
      columns: __getNestedColumns(),
      editing: __getNestedEditing(),
    },
    getColumns: __getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
    nestedChildren: __nestedChildren,
    __getNestedColumns: __getNestedColumns(),
    __getNestedEditing: __getNestedEditing(),
  });
}

Widget.defaultProps = PickedProps;
