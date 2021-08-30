export declare type NestedPropsType = {
  field1?: number;
  fieldTemplate?: any;
  field3?: number;
};
export const NestedProps: NestedPropsType = {};
export declare type BasePropsType = {
  nestedProp?: typeof NestedProps;
};
export const BaseProps: BasePropsType = {
  get nestedProp() {
    return {};
  },
};
export declare type SomePropsType = {
  nestedProp?: typeof NestedProps;
  fieldTemplate?: any;
};
export const SomeProps: SomePropsType = {
  get nestedProp() {
    return BaseProps.nestedProp;
  },
};
