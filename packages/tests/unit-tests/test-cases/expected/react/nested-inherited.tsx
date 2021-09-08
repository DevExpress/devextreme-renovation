export declare type FakeNestedType = {
  baseProp: number;
};
export const FakeNested: FakeNestedType = {
  baseProp: 0,
};
export declare type WidgetPropsType = {
  baseProp: number;
  someProp?: typeof FakeNested;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  baseProp: 0,
  get __defaultNestedValues() {
    return { someProp: FakeNested };
  },
};
export declare type TooltipPropsType = {
  tooltipValue: number;
  tooltipNested?: typeof WidgetProps[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const TooltipProps: TooltipPropsType = {
  tooltipValue: 0,
  get __defaultNestedValues() {
    return {
      tooltipNested: [
        WidgetProps.__defaultNestedValues
          ? WidgetProps.__defaultNestedValues
          : WidgetProps,
      ],
    };
  },
};
export declare type BulletPropsType = typeof WidgetProps & {
  value: number;
  tooltip?: typeof TooltipProps;
  __defaultNestedValues?: any;
};
export const BulletProps: BulletPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(WidgetProps),
    Object.getOwnPropertyDescriptors({
      value: 0,
      get __defaultNestedValues() {
        return {
          tooltip: TooltipProps.__defaultNestedValues
            ? TooltipProps.__defaultNestedValues
            : TooltipProps,
          someProp: WidgetProps?.__defaultNestedValues.someProp,
        };
      },
    })
  )
);
export declare type BulletProps2Type = typeof BulletProps & {
  fakeNestedArr?: typeof FakeNested[];
  __defaultNestedValues?: any;
};
export const BulletProps2: BulletProps2Type = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BulletProps),
    Object.getOwnPropertyDescriptors({
      get __defaultNestedValues() {
        return {
          fakeNestedArr: [FakeNested],
          tooltip: BulletProps?.__defaultNestedValues.tooltip,
          someProp: BulletProps?.__defaultNestedValues.someProp,
        };
      },
    })
  )
);
export declare type BulletProps3Type = typeof BulletProps2 & {
  fakeNestedArr2?: typeof FakeNested[];
  __defaultNestedValues?: any;
};
export const BulletProps3: BulletProps3Type = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BulletProps2),
    Object.getOwnPropertyDescriptors({
      get __defaultNestedValues() {
        return {
          fakeNestedArr2: [FakeNested],
          fakeNestedArr: BulletProps2?.__defaultNestedValues.fakeNestedArr,
          tooltip: BulletProps2?.__defaultNestedValues.tooltip,
          someProp: BulletProps2?.__defaultNestedValues.someProp,
        };
      },
    })
  )
);
