export type GridCellType = {
  gridData: string;
};
export const GridCell: GridCellType = {
  gridData: 'defaultValue',
};
export type GridRowType = {
  cells?: (typeof GridCell | string)[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const GridRow: GridRowType = {
  __defaultNestedValues: Object.freeze({ cells: [GridCell] }) as any,
};
export type WithNestedInputType = {
  rows?: (typeof GridRow)[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WithNestedInput: WithNestedInputType = {
  __defaultNestedValues: Object.freeze({
    rows: [
      GridRow.__defaultNestedValues ? GridRow.__defaultNestedValues : GridRow,
    ],
  }) as any,
};
export type EmptyClassType = {};
export const EmptyClass: EmptyClassType = {};
export type FakeNestedType = {
  value?: (typeof EmptyClass)[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const FakeNested: FakeNestedType = {
  __defaultNestedValues: Object.freeze({ value: [EmptyClass] }) as any,
};
