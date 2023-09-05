export type GridColumnPropsType = {
  name: string;
  index: number;
  editing?: typeof ColumnEditingProps;
  custom?: (typeof CustomProps)[];
  defaultIndex: number;
  indexChange?: (index: number) => void;
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
  editing: typeof EditingProps;
};
export const WidgetProps: WidgetPropsType = {
  editing: Object.freeze(EditingProps) as any,
};
export type PickedPropsType = {
  columns?: Array<typeof GridColumnProps | string>;
  editing: typeof EditingProps;
};
export const PickedProps: PickedPropsType = {
  get editing() {
    return WidgetProps.editing;
  },
};
