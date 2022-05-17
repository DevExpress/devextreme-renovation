
interface GridColumnPropsType {
  name?: string;
  index?: number;
  editing?: typeof ColumnEditingProps;
  custom?: typeof CustomProps[];
  __defaultNestedValues?: any;
  defaultIndex?: number;
  indexChange?: (index: number) => void;
  children?: React.ReactNode;
}
export const GridColumnProps = {
  name: '',
  defaultIndex: 0,
  indexChange: () => {},
} as Partial<GridColumnPropsType>;
interface CustomPropsType {}
export const CustomProps = {} as Partial<CustomPropsType>;
interface AnotherCustomPropsType {}
export const AnotherCustomProps = {} as Partial<AnotherCustomPropsType>;
interface EditingPropsType {
  editEnabled?: boolean;
  custom?: typeof CustomProps[];
  anotherCustom?: typeof AnotherCustomProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const EditingProps = {
  editEnabled: false,
} as Partial<EditingPropsType>;
interface ColumnEditingPropsType {
  editEnabled?: boolean;
}
export const ColumnEditingProps = {
  editEnabled: false,
} as Partial<ColumnEditingPropsType>;
interface WidgetPropsType {
  columns?: Array<typeof GridColumnProps | string>;
  editing?: typeof EditingProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const WidgetProps = {
  __defaultNestedValues: Object.freeze({
    editing: EditingProps.__defaultNestedValues
      ? EditingProps.__defaultNestedValues
      : EditingProps,
  }) as any,
} as Partial<WidgetPropsType>;
interface PickedPropsType {
  columns?: Array<typeof GridColumnProps | string>;
  editing?: typeof EditingProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const PickedProps = {
  __defaultNestedValues: Object.freeze({ editing: WidgetProps.editing }) as any,
} as Partial<PickedPropsType>;
