export type NestedPropsType = {
  field1?: number;
  fieldTemplate?: () => null;
  field3?: number;
  fieldRender?: () => null;
  fieldComponent?: () => null;
};
export const NestedProps: NestedPropsType = {};
export type BasePropsType = {
  nestedProp?: typeof NestedProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const BaseProps: BasePropsType = {
  __defaultNestedValues: Object.freeze({ nestedProp: {} }) as any,
};
export type SomePropsType = {
  nestedProp?: typeof NestedProps;
  children?: React.ReactNode;
  fieldTemplate?: () => null;
  __defaultNestedValues?: any;
  fieldRender?: () => null;
  fieldComponent?: () => null;
};
export const SomeProps: SomePropsType = {
  __defaultNestedValues: Object.freeze({
    nestedProp: BaseProps.nestedProp,
  }) as any,
};
