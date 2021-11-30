import { Injectable, Input } from "@angular/core";
@Injectable()
export class FakeNested {
  __basePropInternalValue?: number = 0;
  @Input()
  set baseProp(value: number | undefined) {
    if (value !== undefined) this.__basePropInternalValue = value;
    else this.__basePropInternalValue = 0;
  }
  get baseProp() {
    return this.__basePropInternalValue;
  }
}

@Injectable()
export class WidgetProps {
  __basePropInternalValue?: number = 0;
  @Input()
  set baseProp(value: number | undefined) {
    if (value !== undefined) this.__basePropInternalValue = value;
    else this.__basePropInternalValue = 0;
  }
  get baseProp() {
    return this.__basePropInternalValue;
  }
  private __someProp__?: FakeNested;
  @Input() set someProp(value: FakeNested) {
    this.__someProp__ = value;
  }
  get someProp(): FakeNested {
    if (!this.__someProp__) {
      return WidgetProps.__defaultNestedValues.someProp;
    }
    return this.__someProp__;
  }
  public static __defaultNestedValues: any = { someProp: new FakeNested() };
}

@Injectable()
export class TooltipProps {
  __tooltipValueInternalValue?: number = 0;
  @Input()
  set tooltipValue(value: number | undefined) {
    if (value !== undefined) this.__tooltipValueInternalValue = value;
    else this.__tooltipValueInternalValue = 0;
  }
  get tooltipValue() {
    return this.__tooltipValueInternalValue;
  }
  private __tooltipNested__?: WidgetProps[];
  @Input() set tooltipNested(value: WidgetProps[]) {
    this.__tooltipNested__ = value;
  }
  get tooltipNested(): WidgetProps[] {
    if (!this.__tooltipNested__) {
      return TooltipProps.__defaultNestedValues.tooltipNested;
    }
    return this.__tooltipNested__;
  }
  public static __defaultNestedValues: any = {
    tooltipNested: [new WidgetProps()],
  };
}

@Injectable()
export class BulletProps extends WidgetProps {
  __valueInternalValue?: number = 0;
  @Input()
  set value(value: number | undefined) {
    if (value !== undefined) this.__valueInternalValue = value;
    else this.__valueInternalValue = 0;
  }
  get value() {
    return this.__valueInternalValue;
  }
  private __tooltip__?: TooltipProps;
  @Input() set tooltip(value: TooltipProps | undefined) {
    this.__tooltip__ = value;
  }
  get tooltip(): TooltipProps | undefined {
    if (!this.__tooltip__) {
      return BulletProps.__defaultNestedValues.tooltip;
    }
    return this.__tooltip__;
  }
  public static __defaultNestedValues: any = {
    tooltip: new TooltipProps(),
    someProp: WidgetProps?.__defaultNestedValues.someProp,
  };
  private __somePropWidgetProps__?: FakeNested;
  @Input() set someProp(value: FakeNested) {
    this.__somePropWidgetProps__ = value;
  }
  get someProp(): FakeNested {
    if (!this.__somePropWidgetProps__) {
      return BulletProps.__defaultNestedValues.someProp;
    }
    return this.__somePropWidgetProps__;
  }
}

@Injectable()
export class BulletProps2 extends BulletProps {
  private __fakeNestedArr__?: FakeNested[];
  @Input() set fakeNestedArr(value: FakeNested[]) {
    this.__fakeNestedArr__ = value;
  }
  get fakeNestedArr(): FakeNested[] {
    if (!this.__fakeNestedArr__) {
      return BulletProps2.__defaultNestedValues.fakeNestedArr;
    }
    return this.__fakeNestedArr__;
  }
  public static __defaultNestedValues: any = {
    fakeNestedArr: [new FakeNested()],
    tooltip: BulletProps?.__defaultNestedValues.tooltip,
    someProp: BulletProps?.__defaultNestedValues.someProp,
  };
  private __tooltipBulletProps__?: TooltipProps;
  @Input() set tooltip(value: TooltipProps | undefined) {
    this.__tooltipBulletProps__ = value;
  }
  get tooltip(): TooltipProps | undefined {
    if (!this.__tooltipBulletProps__) {
      return BulletProps2.__defaultNestedValues.tooltip;
    }
    return this.__tooltipBulletProps__;
  }
  private __somePropBulletProps__?: FakeNested;
  @Input() set someProp(value: FakeNested) {
    this.__somePropBulletProps__ = value;
  }
  get someProp(): FakeNested {
    if (!this.__somePropBulletProps__) {
      return BulletProps2.__defaultNestedValues.someProp;
    }
    return this.__somePropBulletProps__;
  }
}

@Injectable()
export class BulletProps3 extends BulletProps2 {
  private __fakeNestedArr2__?: FakeNested[];
  @Input() set fakeNestedArr2(value: FakeNested[]) {
    this.__fakeNestedArr2__ = value;
  }
  get fakeNestedArr2(): FakeNested[] {
    if (!this.__fakeNestedArr2__) {
      return BulletProps3.__defaultNestedValues.fakeNestedArr2;
    }
    return this.__fakeNestedArr2__;
  }
  public static __defaultNestedValues: any = {
    fakeNestedArr2: [new FakeNested()],
    fakeNestedArr: BulletProps2?.__defaultNestedValues.fakeNestedArr,
    tooltip: BulletProps2?.__defaultNestedValues.tooltip,
    someProp: BulletProps2?.__defaultNestedValues.someProp,
  };
  private __fakeNestedArrBulletProps2__?: FakeNested[];
  @Input() set fakeNestedArr(value: FakeNested[]) {
    this.__fakeNestedArrBulletProps2__ = value;
  }
  get fakeNestedArr(): FakeNested[] {
    if (!this.__fakeNestedArrBulletProps2__) {
      return BulletProps3.__defaultNestedValues.fakeNestedArr;
    }
    return this.__fakeNestedArrBulletProps2__;
  }
  private __tooltipBulletProps2__?: TooltipProps;
  @Input() set tooltip(value: TooltipProps | undefined) {
    this.__tooltipBulletProps2__ = value;
  }
  get tooltip(): TooltipProps | undefined {
    if (!this.__tooltipBulletProps2__) {
      return BulletProps3.__defaultNestedValues.tooltip;
    }
    return this.__tooltipBulletProps2__;
  }
  private __somePropBulletProps2__?: FakeNested;
  @Input() set someProp(value: FakeNested) {
    this.__somePropBulletProps2__ = value;
  }
  get someProp(): FakeNested {
    if (!this.__somePropBulletProps2__) {
      return BulletProps3.__defaultNestedValues.someProp;
    }
    return this.__somePropBulletProps2__;
  }
}
