import { WidgetInput } from "./nested-props";
function view(model: Widget) {
  return <div />;
}

import React, { useCallback, useMemo, HtmlHTMLAttributes } from "react";
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

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  getColumns: () => any;
  isEditable: any;
  restAttributes: RestProps;
  __collectChildren: <T>(children: React.ReactNode) => T[];
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
  const __collectChildren = useCallback(function __collectChildren<T>(
    children: React.ReactNode
  ): T[] {
    return (React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { name: string } })[]).map((child) => {
      const { children: childChildren, ...childProps } = child.props;
      const collectedChildren = {} as any;
      __collectChildren(childChildren).forEach(
        ({ __name, ...restProps }: any) => {
          if (!collectedChildren[__name]) {
            collectedChildren[__name] = [];
            collectedChildren[__name + "s"] = [];
          }
          collectedChildren[__name].push(restProps);
          collectedChildren[__name + "s"].push(restProps);
        }
      );
      return {
        ...collectedChildren,
        ...childProps,
        __name: child.type.name[0].toLowerCase() + child.type.name.slice(1),
      };
    });
  },
  []);

  const __getNestedColumns = useMemo(
    function __getNestedColumns(): Array<GridColumnType | string> | undefined {
      if (props.columns && props.columns.length) {
        return props.columns;
      }
      const nested = __collectChildren<GridColumnType & { __name: string }>(
        props.children
      ).filter((child) => child.__name === "column");
      if (nested.length) {
        return nested;
      }
    },
    [props.columns, props.children]
  );

  const __getNestedGridEditing = useMemo(
    function __getNestedGridEditing(): EditingType | undefined {
      if (props.gridEditing) {
        return props.gridEditing;
      }
      const nested = __collectChildren<EditingType & { __name: string }>(
        props.children
      ).filter((child) => child.__name === "gridEditing");
      if (nested.length) {
        return nested?.[0];
      }
    },
    [props.gridEditing, props.children]
  );

  return view({
    props: {
      ...props,
      columns: __getNestedColumns,
      gridEditing: __getNestedGridEditing,
    },
    getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
    __collectChildren,
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
