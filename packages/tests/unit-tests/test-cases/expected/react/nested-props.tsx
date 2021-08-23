export declare type GridColumnPropsType = {
  name: string;
  index: number;
  editing?: typeof ColumnEditingProps;
  custom?: typeof CustomProps[];
  __defaultNestedValues?: any;
  defaultIndex: number;
  indexChange?: (index: number) => void;
  children?: React.ReactNode;
};
export const GridColumnProps: GridColumnPropsType = {
  name: "",
  defaultIndex: 0,
  indexChange: () => {},
} as any as GridColumnPropsType;
export declare type CustomPropsType = {};
export const CustomProps: CustomPropsType = {};
export declare type AnotherCustomPropsType = {};
export const AnotherCustomProps: AnotherCustomPropsType = {};
export declare type EditingPropsType = {
  editEnabled?: boolean;
  custom?: typeof CustomProps[];
  anotherCustom?: typeof AnotherCustomProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const EditingProps: EditingPropsType = { editEnabled: false };
export declare type ColumnEditingPropsType = {
  editEnabled?: boolean;
};
export const ColumnEditingProps: ColumnEditingPropsType = {
  editEnabled: false,
};
export declare type WidgetPropsType = {
  columns?: Array<typeof GridColumnProps | string>;
  editing?: typeof EditingProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = Object.defineProperties(
  {},
  {
    __defaultNestedValues: {
      enumerable: true,
      get: function () {
        return {
          editing: EditingProps.__defaultNestedValues
            ? EditingProps.__defaultNestedValues
            : EditingProps,
        };
      },
    },
  }
);
export declare type PickedPropsType = {
  columns?: Array<typeof GridColumnProps | string>;
  editing?: typeof EditingProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const PickedProps: PickedPropsType = Object.defineProperties(
  {},
  {
    __defaultNestedValues: {
      enumerable: true,
      get: function () {
        return { editing: WidgetProps.editing };
      },
    },
  }
);
