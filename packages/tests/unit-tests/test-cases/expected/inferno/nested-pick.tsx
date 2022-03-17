export type NestedPropsType = {
  field1?: number;
  fieldTemplate?: any;
  field3?: number;
};
export const NestedProps: NestedPropsType = {};
export type BasePropsType = {
  nestedProp?: typeof NestedProps;
};
export const BaseProps: BasePropsType = {
  nestedProp: Object.freeze({}) as any,
};
export type SomePropsType = {
  nestedProp?: typeof NestedProps;
  fieldTemplate?: any;
};
export const SomeProps: SomePropsType = {
  get nestedProp() {
    return BaseProps.nestedProp;
  },
};
