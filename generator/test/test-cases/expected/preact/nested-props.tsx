export declare type GridColumnType = {
  name: string;
  index: number;
  editing?: typeof ColumnEditing;
  custom?: typeof Custom[];
  defaultIndex?: number;
  indexChange?: (index: number) => void;
};
export const GridColumn: GridColumnType = ({
  name: "",
  editing: {},
  custom: [],
  defaultIndex: 0,
  indexChange: () => {},
} as any) as GridColumnType;
export declare type CustomType = {};
export const Custom: CustomType = {};
export declare type AnotherCustomType = {};
export const AnotherCustom: AnotherCustomType = {};
export declare type EditingType = {
  editEnabled?: boolean;
  custom?: typeof Custom[];
  anotherCustom?: typeof AnotherCustom;
};
export const Editing: EditingType = {
  editEnabled: false,
  custom: [],
  anotherCustom: {},
};
export declare type ColumnEditingType = {
  editEnabled?: boolean;
};
export const ColumnEditing: ColumnEditingType = {
  editEnabled: false,
};
export declare type WidgetInputType = {
  columns?: Array<typeof GridColumn | string>;
  editing?: typeof Editing;
};
export const WidgetInput: WidgetInputType = {};
