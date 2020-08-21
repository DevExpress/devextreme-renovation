import { WidgetInput } from "./nested-props";
function view(model: Widget) {
  return <div />;
}

import React, { useCallback, HtmlHTMLAttributes } from "react";

function __collectChildren<T>(children: React.ReactNode): T[] {
  return (React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && typeof child.type !== "string"
  ) as (React.ReactElement & { type: { propName: string } })[]).map((child) => {
    const { children: childChildren, ...childProps } = child.props;
    const collectedChildren = {} as any;
    __collectChildren(childChildren).forEach(
      ({ __name, ...restProps }: any) => {
        if (__name) {
          if (!collectedChildren[__name]) {
            collectedChildren[__name] = [];
          }
          collectedChildren[__name].push(restProps);
        }
      }
    );
    return {
      ...collectedChildren,
      ...childProps,
      __name: child.type.propName,
    };
  });
}
import {
  GridColumnType,
  EditingType,
  CustomType,
  ColumnEditingType,
  AnotherCustomType,
} from "./nested-props";
export const Column: React.FunctionComponent<GridColumnType> & {
  propName: string;
} = () => null;
Column.propName = "columns";
export const Editing: React.FunctionComponent<EditingType> & {
  propName: string;
} = () => null;
Editing.propName = "editing";
export const ColumnCustom: React.FunctionComponent<CustomType> & {
  propName: string;
} = () => null;
ColumnCustom.propName = "custom";
export const ColumnEditing: React.FunctionComponent<ColumnEditingType> & {
  propName: string;
} = () => null;
ColumnEditing.propName = "editing";
export const EditingCustom: React.FunctionComponent<CustomType> & {
  propName: string;
} = () => null;
EditingCustom.propName = "custom";
export const EditingAnotherCustom: React.FunctionComponent<
  AnotherCustomType
> & { propName: string } = () => null;
EditingAnotherCustom.propName = "anotherCustom";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  getColumns: () => any;
  isEditable: any;
  restAttributes: RestProps;
  __nestedChildren: <T>() => T[];
  __getNestedColumns: Array<GridColumnType | string> | undefined;
  __getNestedEditing: EditingType | undefined;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const getColumns = useCallback(
    function getColumns(): any {
      return __getNestedColumns()?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
    [props.columns, props.children]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return (
        __getNestedEditing()?.editEnabled ||
        __getNestedEditing()?.custom?.length
      );
    },
    [props.editing, props.children]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, columns, editing, ...restProps } = {
        ...props,
        columns: __getNestedColumns(),
        editing: __getNestedEditing(),
      };
      return restProps;
    },
    [props]
  );
  const __nestedChildren = useCallback(
    function __nestedChildren<T>(): T[] {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedColumns = useCallback(
    function __getNestedColumns(): Array<GridColumnType | string> | undefined {
      const nested = __nestedChildren<
        GridColumnType & { __name: string }
      >().filter((child) => child.__name === "columns");
      return props.columns && props.columns.length
        ? props.columns
        : nested.length
        ? nested
        : undefined;
    },
    [props.columns, props.children]
  );
  const __getNestedEditing = useCallback(
    function __getNestedEditing(): EditingType | undefined {
      const nested = __nestedChildren<
        EditingType & { __name: string }
      >().filter((child) => child.__name === "editing");
      return props.editing
        ? props.editing
        : nested.length
        ? nested?.[0]
        : undefined;
    },
    [props.editing, props.children]
  );

  return view({
    props: {
      ...props,
      columns: __getNestedColumns(),
      editing: __getNestedEditing(),
    },
    getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
    __nestedChildren,
    __getNestedColumns: __getNestedColumns(),
    __getNestedEditing: __getNestedEditing(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
