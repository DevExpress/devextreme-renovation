import { WithNestedInput } from "./nested-default-props";
function view({ getRowCells, props: { rows } }: WithNested) {
  return (
    <div>
      {rows ? (
        rows.length ? (
          rows?.map((_, index) => (
            <span key={index}>
              {getRowCells(index)}

              <br />
            </span>
          ))
        ) : (
          <span>{"Empty Array"}</span>
        )
      ) : (
        <span>{"No Data"}</span>
      )}
    </div>
  );
}

import * as React from "react";
import { useCallback } from "react";

function __collectChildren(children: React.ReactNode): Record<string, any> {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).reduce((acc: Record<string, any>, child) => {
    const { children: childChildren, ...childProps } = child.props;
    const collectedChildren = __collectChildren(childChildren);
    const allChild = { ...childProps, ...collectedChildren };
    return {
      ...acc,
      [child.type.propName]: acc[child.type.propName]
        ? [...acc[child.type.propName], allChild]
        : [allChild],
    };
  }, {});
}
import { GridRow, GridCell } from "./nested-default-props";
export const Row: React.FunctionComponent<typeof GridRow> & {
  propName: string;
} = () => null;
Row.propName = "rows";
Row.defaultProps = GridRow;
export const RowCell: React.FunctionComponent<typeof GridCell> & {
  propName: string;
} = () => null;
RowCell.propName = "cells";
RowCell.defaultProps = GridCell;

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WithNested {
  props: typeof WithNestedInput & RestProps;
  getRowCells: (index: number) => any;
  restAttributes: RestProps;
  nestedChildren: () => Record<string, any>;
  __getNestedRows: typeof GridRow[];
}

export default function WithNested(props: typeof WithNestedInput & RestProps) {
  const __getRowCells = useCallback(
    function __getRowCells(index: number): any {
      const cells = __getNestedRows()?.[index].cells;
      return (
        cells
          ?.map((cell) => (typeof cell === "string" ? cell : cell.gridData))
          .join("|") || []
      );
    },
    [props.rows, props.children]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { __defaultNestedValues, children, rows, ...restProps } = {
        ...props,
        rows: __getNestedRows(),
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
  const __getNestedRows = useCallback(
    function __getNestedRows(): typeof GridRow[] {
      const nested = __nestedChildren();
      return props.rows
        ? props.rows
        : nested.rows
        ? nested.rows
        : props?.__defaultNestedValues?.rows;
    },
    [props.rows, props.children]
  );

  return view({
    props: { ...props, rows: __getNestedRows() },
    getRowCells: __getRowCells,
    restAttributes: __restAttributes(),
    nestedChildren: __nestedChildren,
    __getNestedRows: __getNestedRows(),
  });
}

WithNested.defaultProps = WithNestedInput;
