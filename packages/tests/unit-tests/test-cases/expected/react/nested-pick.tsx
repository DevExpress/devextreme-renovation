export declare type NestedPropsType = {
  field1?: number;
  fieldTemplate?: () => null;
  field3?: number;
  fieldRender?: () => null;
  fieldComponent?: () => null;
};
export const NestedProps: NestedPropsType = {};
export declare type BasePropsType = {
  nestedProp?: typeof NestedProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const BaseProps: BasePropsType = Object.defineProperties(
  {},
  {
    __defaultNestedValues: {
      enumerable: true,
      get: function () {
        return { nestedProp: {} };
      },
    },
  }
);
export declare type SomePropsType = {
  nestedProp?: typeof NestedProps;
  children?: React.ReactNode;
  fieldTemplate?: () => null;
  __defaultNestedValues?: any;
  fieldRender?: () => null;
  fieldComponent?: () => null;
};
export const SomeProps: SomePropsType = Object.defineProperties(
  {},
  {
    __defaultNestedValues: {
      enumerable: true,
      get: function () {
        return { nestedProp: BaseProps.nestedProp };
      },
    },
  }
);
