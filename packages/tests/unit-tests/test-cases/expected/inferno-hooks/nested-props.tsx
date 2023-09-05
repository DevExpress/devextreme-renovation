export type GridColumnPropsType = {
  name: string;
  index: number;
  editing?: typeof ColumnEditingProps;
  custom?: (typeof CustomProps)[];
  __defaultNestedValues?: any;
  defaultIndex: number;
  indexChange?: (index: number) => void;
  children?: React.ReactNode;
};
export const GridColumnProps: GridColumnPropsType = {
  name: '',
  defaultIndex: 0,
  indexChange: () => {},
} as any as GridColumnPropsType;
export type CustomPropsType = {};
export const CustomProps: CustomPropsType = {};
export type AnotherCustomPropsType = {};
export const AnotherCustomProps: AnotherCustomPropsType = {};
export type EditingPropsType = {
  editEnabled?: boolean;
  custom?: (typeof CustomProps)[];
  anotherCustom?: typeof AnotherCustomProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const EditingProps: EditingPropsType = {
  editEnabled: false,
};
export type ColumnEditingPropsType = {
  editEnabled?: boolean;
};
export const ColumnEditingProps: ColumnEditingPropsType = {
  editEnabled: false,
};
export type WidgetPropsType = {
  columns?: Array<typeof GridColumnProps | string>;
  editing?: typeof EditingProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  __defaultNestedValues: Object.freeze({
    editing: EditingProps.__defaultNestedValues
      ? EditingProps.__defaultNestedValues
      : EditingProps,
  }) as any,
};
export type PickedPropsType = {
  columns?: Array<typeof GridColumnProps | string>;
  editing?: typeof EditingProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const PickedProps: PickedPropsType = {
  __defaultNestedValues: Object.freeze({ editing: WidgetProps.editing }) as any,
};
