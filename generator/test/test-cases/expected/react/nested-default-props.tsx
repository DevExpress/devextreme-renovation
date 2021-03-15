export declare type GridCellType = {
  gridData?: string;
};
export const GridCell: GridCellType = {
  gridData: "defaultValue",
};
export declare type GridRowType = {
  cells?: (typeof GridCell | string)[];
  children?: React.ReactNode;
  __defaultNestedValues?: GridRowType;
};
export const GridRow: GridRowType = {
  __defaultNestedValues: { cells: [GridCell] },
};
export declare type WithNestedInputType = {
  rows?: typeof GridRow[];
  dateTime?: Date;
  children?: React.ReactNode;
  __defaultNestedValues?: WithNestedInputType;
};
export const WithNestedInput: WithNestedInputType = {
  dateTime: new Date(),
  __defaultNestedValues: {
    rows: [
      GridRow.__defaultNestedValues ? GridRow.__defaultNestedValues : GridRow,
    ],
    dateTime: new Date(),
  },
};
export declare type EmptyClassType = {};
export const EmptyClass: EmptyClassType = {};
export declare type FakeNestedType = {
  value?: typeof EmptyClass[];
  children?: React.ReactNode;
  __defaultNestedValues?: FakeNestedType;
};
export const FakeNested: FakeNestedType = {
  __defaultNestedValues: { value: [EmptyClass] },
};
