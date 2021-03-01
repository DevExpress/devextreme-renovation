export declare type GridCellType = {
  gridData?: string;
};
export const GridCell: GridCellType = {
  gridData: "defaultValue",
};
export declare type GridRowType = {
  cells?: (typeof GridCell | string)[];
  children?: React.ReactNode;
  __defaultNestedValues?: () => GridRowType;
};
export const GridRow: GridRowType = {
  __defaultNestedValues: () => ({ cells: [GridCell] }),
};
export declare type WithNestedInputType = {
  rows?: typeof GridRow[];
  children?: React.ReactNode;
  __defaultNestedValues?: () => WithNestedInputType;
};
export const WithNestedInput: WithNestedInputType = {
  __defaultNestedValues: () => ({
    rows: [
      GridRow.__defaultNestedValues ? GridRow.__defaultNestedValues() : GridRow,
    ],
  }),
};
