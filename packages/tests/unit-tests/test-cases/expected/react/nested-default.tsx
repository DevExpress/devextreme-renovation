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
import { useCallback, DOMAttributes, HTMLAttributes } from "react";

function __collectChildren<T>(children: React.ReactNode): T[] {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).map((child) => {
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

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WithNestedInput | keyof DOMAttributes<HTMLElement>
>;
interface WithNested {
  props: typeof WithNestedInput & RestProps;
  getRowCells: (index: number) => any;
  restAttributes: RestProps;
  nestedChildren: <T>() => T[];
  __getNestedRows: typeof GridRow[] | undefined;
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
    function __nestedChildren<T>(): T[] {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedRows = useCallback(
    function __getNestedRows(): typeof GridRow[] | undefined {
      const nested = __nestedChildren<typeof GridRow & { __name: string }>()
        .filter((child) => child.__name === "rows")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return (n as any)?.__defaultNestedValues || n;
          }
          return n;
        });
      return props.rows
        ? props.rows
        : nested.length
        ? nested
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

WithNested.defaultProps = {
  ...WithNestedInput,
};
