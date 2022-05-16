
interface NestedPropsType {
  field1?: number;
  fieldTemplate?: () => null;
  field3?: number;
  fieldRender?: () => null;
  fieldComponent?: () => null;
}
export const NestedProps = {} as Partial<NestedPropsType>;
interface BasePropsType {
  nestedProp?: typeof NestedProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const BaseProps = {
  __defaultNestedValues: Object.freeze({ nestedProp: {} }) as any,
} as Partial<BasePropsType>;
interface SomePropsType {
  nestedProp?: typeof NestedProps;
  children?: React.ReactNode;
  fieldTemplate?: () => null;
  __defaultNestedValues?: any;
  fieldRender?: () => null;
  fieldComponent?: () => null;
}
export const SomeProps = {
  __defaultNestedValues: Object.freeze({
    nestedProp: BaseProps.nestedProp,
  }) as any,
} as Partial<SomePropsType>;
