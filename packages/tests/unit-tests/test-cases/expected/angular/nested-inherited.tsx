import { Input } from "@angular/core";
export class FakeNested {
  @Input() baseProp: number = 0;
}

export class WidgetProps {
  @Input() baseProp: number = 0;
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

export class TooltipProps {
  @Input() tooltipValue: number = 0;
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

export class BulletProps extends WidgetProps {
  @Input() value: number = 0;
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
  private __somePropInherited__?: FakeNested;
  @Input() set someProp(value: FakeNested) {
    this.__somePropInherited__ = value;
  }
  get someProp(): FakeNested {
    if (!this.__somePropInherited__) {
      return BulletProps.__defaultNestedValues.someProp;
    }
    return this.__somePropInherited__;
  }
}
