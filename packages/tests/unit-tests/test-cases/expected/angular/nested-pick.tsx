import { Component, Input, TemplateRef } from "@angular/core";
@Component({
  template: "",
})
export class NestedProps {
  @Input() field1?: number;
  @Input() fieldTemplate?: TemplateRef<any> | null = null;
  @Input() field3?: number;
}

@Component({
  template: "",
})
export class BaseProps {
  private __nestedProp__?: NestedProps;
  @Input() set nestedProp(value: NestedProps | undefined) {
    this.__nestedProp__ = value;
  }
  get nestedProp(): NestedProps | undefined {
    if (!this.__nestedProp__) {
      return BaseProps.__defaultNestedValues.nestedProp;
    }
    return this.__nestedProp__;
  }
  public static __defaultNestedValues: any = { nestedProp: {} };
}

@Component({
  template: "",
})
export class SomeProps {
  private __nestedProp__?: NestedProps;
  @Input() set nestedProp(value: NestedProps | undefined) {
    this.__nestedProp__ = value;
  }
  get nestedProp(): NestedProps | undefined {
    if (!this.__nestedProp__) {
      return SomeProps.__defaultNestedValues.nestedProp;
    }
    return this.__nestedProp__;
  }
  @Input() fieldTemplate?: TemplateRef<any> | null = null;
  public static __defaultNestedValues: any = {
    nestedProp: new BaseProps().nestedProp,
  };
}
