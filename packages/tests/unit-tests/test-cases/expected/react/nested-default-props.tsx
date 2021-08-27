export declare type GridCellType = {
  gridData: string;
};
export const GridCell: GridCellType = {
  gridData: "defaultValue",
};
export declare type GridRowType = {
  cells?: (typeof GridCell | string)[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const GridRow: GridRowType = {
  get __defaultNestedValues() {
    return { cells: [GridCell] };
  },
};
export declare type WithNestedInputType = {
  rows?: typeof GridRow[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WithNestedInput: WithNestedInputType = {
  get __defaultNestedValues() {
    return {
      rows: [
        GridRow.__defaultNestedValues ? GridRow.__defaultNestedValues : GridRow,
      ],
    };
  },
};
export declare type EmptyClassType = {};
export const EmptyClass: EmptyClassType = {};
export declare type FakeNestedType = {
  value?: typeof EmptyClass[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const FakeNested: FakeNestedType = {
  get __defaultNestedValues() {
    return { value: [EmptyClass] };
  },
};
