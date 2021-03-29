import { Input } from "@angular/core";
export class FakeNested {
  @Input() sas: number = 2;
}

export class WidgetProps {
  private __nestedProp__?: FakeNested[];
  @Input() set nestedProp(value: FakeNested[] | undefined) {
    this.__nestedProp__ = value;
  }
  get nestedProp(): FakeNested[] | undefined {
    return this.__nestedProp__;
  }
  private __anotherNestedPropInit__?: FakeNested[];
  @Input() set anotherNestedPropInit(value: FakeNested[]) {
    this.__anotherNestedPropInit__ = value;
  }
  get anotherNestedPropInit(): FakeNested[] {
    if (!this.__anotherNestedPropInit__) {
      return WidgetProps.__defaultNestedValues.anotherNestedPropInit;
    }
    return this.__anotherNestedPropInit__;
  }
  public static __defaultNestedValues: any = {
    anotherNestedPropInit: [new FakeNested()],
  };
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ContentChildren,
  QueryList,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Directive({
  selector: "dx-undef-widget dxi-another-nested-prop-init",
})
class DxUndefWidgetAnotherNestedPropInit extends FakeNested {}

@Directive({
  selector: "dx-undef-widget dxi-nested-prop",
})
class DxUndefWidgetNestedProp extends FakeNested {}

@Component({
  selector: "dx-undef-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["nestedProp", "anotherNestedPropInit"],
  template: `<div
    ><div>Nested:{{ __nested }}</div></div
  >`,
})
export default class undefWidget extends WidgetProps {
  get __nested(): any {
    return this.hasOwnProperty("nestedProp");
  }
  get __nestedinit(): any {
    return this.hasOwnProperty("anotherNestedPropInit");
  }
  private __nestedProp?: DxUndefWidgetNestedProp[];
  @ContentChildren(DxUndefWidgetNestedProp)
  nestedPropNested?: QueryList<DxUndefWidgetNestedProp>;
  get nestedProp(): DxUndefWidgetNestedProp[] | undefined {
    if (this.__nestedProp) {
      return this.__nestedProp;
    }
    const nested = this.nestedPropNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
  }
  private __anotherNestedPropInit?: DxUndefWidgetAnotherNestedPropInit[];
  @ContentChildren(DxUndefWidgetAnotherNestedPropInit)
  anotherNestedPropInitNested?: QueryList<DxUndefWidgetAnotherNestedPropInit>;
  get anotherNestedPropInit(): DxUndefWidgetAnotherNestedPropInit[] {
    if (this.__anotherNestedPropInit) {
      return this.__anotherNestedPropInit;
    }
    const nested = this.anotherNestedPropInitNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
    return WidgetProps.__defaultNestedValues.anotherNestedPropInit;
  }
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngAfterViewInit() {
    this._detectChanges();
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  @Input() set nestedProp(value: DxUndefWidgetNestedProp[] | undefined) {
    this.__nestedProp = value;
    this._detectChanges();
  }
  @Input() set anotherNestedPropInit(
    value: DxUndefWidgetAnotherNestedPropInit[]
  ) {
    this.__anotherNestedPropInit = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [
    undefWidget,
    DxUndefWidgetNestedProp,
    DxUndefWidgetAnotherNestedPropInit,
  ],
  imports: [CommonModule],

  exports: [
    undefWidget,
    DxUndefWidgetNestedProp,
    DxUndefWidgetAnotherNestedPropInit,
  ],
})
export class DxundefWidgetModule {}
export { undefWidget as DxundefWidgetComponent };
