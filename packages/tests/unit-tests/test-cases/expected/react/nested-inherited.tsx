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
  __defaultNestedValues: { someProp: FakeNested },
};
export declare type TooltipPropsType = {
  tooltipValue: number;
  tooltipNested?: typeof WidgetProps[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const TooltipProps: TooltipPropsType = {
  tooltipValue: 0,
  __defaultNestedValues: {
    tooltipNested: [
      WidgetProps.__defaultNestedValues
        ? WidgetProps.__defaultNestedValues
        : WidgetProps,
    ],
  },
};
export declare type BulletPropsType = typeof WidgetProps & {
  value: number;
  tooltip?: typeof TooltipProps;
  __defaultNestedValues?: any;
};
export const BulletProps: BulletPropsType = {
  ...WidgetProps,
  value: 0,
  __defaultNestedValues: {
    tooltip: TooltipProps.__defaultNestedValues
      ? TooltipProps.__defaultNestedValues
      : TooltipProps,
    someProp: WidgetProps?.__defaultNestedValues.someProp,
  },
};
