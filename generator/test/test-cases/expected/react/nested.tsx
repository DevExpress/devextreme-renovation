import { WidgetInput } from "./nested-props";
function view(model: Widget) {
  return <div />;
}

import React, { useCallback, useMemo } from "react";
import {
  GridColumnType,
  EditingType,
  CustomType,
  AnotherCustomType,
} from "./nested-props";
export const Column: React.FunctionComponent<GridColumnType> = () => null;
export const GridEditing: React.FunctionComponent<EditingType> = () => null;
export const Custom: React.FunctionComponent<CustomType> = () => null;
export const AnotherCustom: React.FunctionComponent<AnotherCustomType> = () =>
  null;

declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  getColumns: () => any;
  isEditable: any;
  restAttributes: RestProps;
  __getNestedFromChild: <T>(typeName: string) => T[];
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const getColumns = useCallback(
    function getColumns(): any {
      return __getNestedColumns?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
    [props.columns, props.children]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return (
        __getNestedGridEditing?.editEnabled ||
        __getNestedGridEditing?.custom?.length
      );
    },
    [props.gridEditing, props.children]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, columns, gridEditing, ...restProps } = {
        ...props,
        columns: __getNestedColumns,
        gridEditing: __getNestedGridEditing,
      };
      return restProps;
    },
    [props]
  );
  const __getNestedFromChild = useCallback(
    function __getNestedFromChild<T>(typeName: string): T[] {
      const children = props.children,
        nestedComponents = React.Children.toArray(children).filter(
          (child) =>
            React.isValidElement(child) &&
            typeof child.type !== "string" &&
            child.type.name === typeName
        ) as React.ReactElement[];
      return nestedComponents.map((comp) => comp.props);
    },
    [props.children]
  );

  const __getNestedColumns = useMemo(
    function __getNestedColumns(): Array<GridColumnType | string> {
      return props.columns || __getNestedFromChild<GridColumnType>("Column");
    },
    [props.columns, props.children]
  );

  const __getNestedGridEditing = useMemo(
    function __getNestedGridEditing(): EditingType {
      return (
        props.gridEditing ||
        __getNestedFromChild<EditingType>("GridEditing")?.[0]
      );
    },
    [props.gridEditing, props.children]
  );

  return view({
    props: { ...props },
    getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
    __getNestedFromChild,
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
