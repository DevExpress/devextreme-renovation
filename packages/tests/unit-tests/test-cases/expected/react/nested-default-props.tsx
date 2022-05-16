
interface GridCellType {
  gridData?: string;
}
export const GridCell = {
  gridData: 'defaultValue',
} as Partial<GridCellType>;
interface GridRowType {
  cells?: (typeof GridCell | string)[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const GridRow = {
  __defaultNestedValues: Object.freeze({ cells: [GridCell] }) as any,
} as Partial<GridRowType>;
interface WithNestedInputType {
  rows?: typeof GridRow[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const WithNestedInput = {
  __defaultNestedValues: Object.freeze({
    rows: [
      GridRow.__defaultNestedValues ? GridRow.__defaultNestedValues : GridRow,
    ],
  }) as any,
} as Partial<WithNestedInputType>;
interface EmptyClassType {}
export const EmptyClass = {} as Partial<EmptyClassType>;
interface FakeNestedType {
  value?: typeof EmptyClass[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const FakeNested = {
  __defaultNestedValues: Object.freeze({ value: [EmptyClass] }) as any,
} as Partial<FakeNestedType>;
