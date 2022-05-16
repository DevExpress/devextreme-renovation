import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { WithNestedInput } from './nested-default-props';
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
          <span>{'Empty Array'}</span>
        )
      ) : (
        <span>{'No Data'}</span>
      )}
    </div>
  );
}

import { __collectChildren, equalByValue } from '@devextreme/runtime/react';
import * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';

import { GridRow, GridCell } from './nested-default-props';
export const Row: React.FunctionComponent<typeof GridRow> & {
  propName: string;
} = () => null;
Row.propName = 'rows';
Row.defaultProps = GridRow;
export const RowCell: React.FunctionComponent<typeof GridCell> & {
  propName: string;
} = () => null;
RowCell.propName = 'cells';
RowCell.defaultProps = GridCell;

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WithNestedInputModel = Required<
  Omit<GetPropsType<typeof WithNestedInput>, 'children'>
> &
  Partial<Pick<GetPropsType<typeof WithNestedInput>, 'children'>>;
interface WithNested {
  props: WithNestedInputModel & RestProps;
  __getNestedRows: typeof GridRow[];
  getRowCells: (index: number) => any;
  restAttributes: RestProps;
}
export default function WithNested(
  inProps: typeof WithNestedInput & RestProps
) {
  const props = combineWithDefaultProps<WithNestedInputModel>(
    WithNestedInput,
    inProps
  );

  const cachedNested = useRef<any>(__collectChildren(props.children));

  const __getNestedRows = useMemo(
    function __getNestedRows(): typeof GridRow[] {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.rows
        ? props.rows
        : cachedNested.current.rows
        ? cachedNested.current.rows
        : props?.__defaultNestedValues?.rows;
    },
    [props.rows, props.children]
  );
  const __getRowCells = useCallback(
    function __getRowCells(index: number): any {
      const cells = __getNestedRows?.[index].cells;
      return (
        cells
          ?.map((cell) => (typeof cell === 'string' ? cell : cell.gridData))
          .join('|') || []
      );
    },
    [__getNestedRows]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { __defaultNestedValues, children, rows, ...restProps } = {
        ...props,
        rows: __getNestedRows,
      };
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props, rows: __getNestedRows },
    __getNestedRows,
    getRowCells: __getRowCells,
    restAttributes: __restAttributes(),
  });
}
