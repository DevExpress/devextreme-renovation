export declare type GridCellType = {
  gridData?: string;
};
export const GridCell: GridCellType = {
  gridData: "defaultValue",
};
export declare type GridRowType = {
  cells?: (typeof GridCell | string)[];
  __defaultNestedValues?: GridRowType;
  children?: React.ReactNode;
};
export const GridRow: GridRowType = {
  __defaultNestedValues: { cells: [GridCell] },
};
export declare type WithNestedInputType = {
  rows?: typeof GridRow[];
  __defaultNestedValues?: WithNestedInputType;
  children?: React.ReactNode;
};
export const WithNestedInput: WithNestedInputType = {
  __defaultNestedValues: {
    rows: [
      GridRow.__defaultNestedValues ? GridRow.__defaultNestedValues : GridRow,
    ],
  },
};
export declare type EmptyClassType = {};
export const EmptyClass: EmptyClassType = {};
export declare type FakeNestedType = {
  value?: typeof EmptyClass[];
  __defaultNestedValues?: FakeNestedType;
  children?: React.ReactNode;
};
export const FakeNested: FakeNestedType = {
  __defaultNestedValues: { value: [EmptyClass] },
};
