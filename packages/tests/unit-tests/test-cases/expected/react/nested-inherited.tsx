import { GetPropsType } from '@devextreme/runtime/react';

interface FakeNestedType {
  baseProp?: number;
}
export const FakeNested = {
  baseProp: 0,
} as Partial<FakeNestedType>;
interface WidgetPropsType {
  baseProp?: number;
  someProp?: typeof FakeNested;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const WidgetProps = {
  baseProp: 0,
  __defaultNestedValues: Object.freeze({ someProp: FakeNested }) as any,
} as Partial<WidgetPropsType>;
interface TooltipPropsType {
  tooltipValue?: number;
  tooltipNested?: typeof WidgetProps[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
}
export const TooltipProps = {
  tooltipValue: 0,
  __defaultNestedValues: Object.freeze({
    tooltipNested: [
      WidgetProps.__defaultNestedValues
        ? WidgetProps.__defaultNestedValues
        : WidgetProps,
    ],
  }) as any,
} as Partial<TooltipPropsType>;
interface BulletPropsType extends GetPropsType<typeof WidgetProps> {
  value?: number;
  tooltip?: typeof TooltipProps;
  __defaultNestedValues?: any;
}
export const BulletProps = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(WidgetProps),
    Object.getOwnPropertyDescriptors({
      value: 0,
      __defaultNestedValues: Object.freeze({
        tooltip: TooltipProps.__defaultNestedValues
          ? TooltipProps.__defaultNestedValues
          : TooltipProps,
        someProp: WidgetProps?.__defaultNestedValues.someProp,
      }) as any,
    })
  )
) as Partial<BulletPropsType>;
interface BulletProps2Type extends GetPropsType<typeof BulletProps> {
  fakeNestedArr?: typeof FakeNested[];
  __defaultNestedValues?: any;
}
export const BulletProps2 = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BulletProps),
    Object.getOwnPropertyDescriptors({
      __defaultNestedValues: Object.freeze({
        fakeNestedArr: [FakeNested],
        tooltip: BulletProps?.__defaultNestedValues.tooltip,
        someProp: BulletProps?.__defaultNestedValues.someProp,
      }) as any,
    })
  )
) as Partial<BulletProps2Type>;
interface BulletProps3Type extends GetPropsType<typeof BulletProps2> {
  fakeNestedArr2?: typeof FakeNested[];
  __defaultNestedValues?: any;
}
export const BulletProps3 = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BulletProps2),
    Object.getOwnPropertyDescriptors({
      __defaultNestedValues: Object.freeze({
        fakeNestedArr2: [FakeNested],
        fakeNestedArr: BulletProps2?.__defaultNestedValues.fakeNestedArr,
        tooltip: BulletProps2?.__defaultNestedValues.tooltip,
        someProp: BulletProps2?.__defaultNestedValues.someProp,
      }) as any,
    })
  )
) as Partial<BulletProps3Type>;
