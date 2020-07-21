export declare type GridColumnType = {
  name: string;
  index: number;
  defaultIndex?: number;
  indexChange?: (index: number) => void;
};
export const GridColumn: GridColumnType = {
  name: "",
  index: 0,
  defaultIndex: 0,
  indexChange: () => {},
};

export declare type CustomType = {};
export const Custom: CustomType = {};

export declare type EditingType = {
  editEnabled?: boolean;
  custom?: typeof Custom[];
};
export const Editing: EditingType = {
  editEnabled: false,
  custom: [],
};

export declare type WidgetInputType = {
  columns?: Array<typeof GridColumn | string>;
  gridEditing?: typeof Editing;
};
export const WidgetInput: WidgetInputType = {};
