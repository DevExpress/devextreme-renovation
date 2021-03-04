export declare type GridCellType = {
  gridData?: string;
};
export const GridCell: GridCellType = {
  gridData: "defaultValue",
};
export declare type GridRowType = {
  cells?: (typeof GridCell | string)[];
};
export const GridRow: GridRowType = {
  cells: [GridCell],
};
export declare type WithNestedInputType = {
  rows?: typeof GridRow[];
};
export const WithNestedInput: WithNestedInputType = {
  rows: [GridRow],
};
