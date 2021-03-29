import { Input } from "@angular/core";
export class FakeNested {
  @Input() sas: number = 2;
}

import {
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
export class WidgetProps {
  @Input() oneWayProp?: Number;
  @Input() twoWayProp?: number;
  private __nestedProp__?: FakeNested[];
  @Input() set nestedProp(value: FakeNested[] | undefined) {
    this.__nestedProp__ = value;
  }
  get nestedProp(): FakeNested[] | undefined {
    return this.__nestedProp__;
  }
  @Input() refProp?: any;
  @Input() forwardRefProp?: (
    ref?: ElementRef<any>
  ) => ElementRef<any> | undefined;
  @Input() templateProp?: TemplateRef<any> | null = null;
  @Output() onSomething: EventEmitter<number> = new EventEmitter();
  __slotChildrenSlot?: ElementRef<HTMLDivElement>;

  get childrenSlot() {
    const childNodes = this.__slotChildrenSlot?.nativeElement?.childNodes;
    return childNodes && childNodes.length > 2;
  }
  @Input() oneWayPropInit: number = 2;
  private __nestedPropInit__?: FakeNested[];
  @Input() set nestedPropInit(value: FakeNested[] | undefined) {
    this.__nestedPropInit__ = value;
  }
  get nestedPropInit(): FakeNested[] | undefined {
    if (!this.__nestedPropInit__) {
      return WidgetProps.__defaultNestedValues.nestedPropInit;
    }
    return this.__nestedPropInit__;
  }
  public static __defaultNestedValues: any = {
    onSomething: (e: any) => void 0,
    oneWayPropInit: 2,
    nestedPropInit: [new FakeNested()],
  };
  @Output() twoWayPropChange: EventEmitter<
    number | undefined
  > = new EventEmitter();
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
  selector: "dx-undef-widget dxi-nested-prop-init",
})
class DxUndefWidgetNestedPropInit extends FakeNested {}

@Directive({
  selector: "dx-undef-widget dxi-nested-prop",
})
class DxUndefWidgetNestedProp extends FakeNested {}

@Component({
  selector: "dx-undef-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    "oneWayProp",
    "twoWayProp",
    "nestedProp",
    "refProp",
    "forwardRefProp",
    "templateProp",
    "oneWayPropInit",
    "nestedPropInit",
  ],
  outputs: ["onSomething", "twoWayPropChange"],
  template: `<div
      ><div>OneWay:{{ __oneway }}</div></div
    ><ng-template #dxchildrenSlot
      ><ng-content select="[childrenSlot]"></ng-content
    ></ng-template>`,
})
export default class undefWidget extends WidgetProps {
  get __oneway(): any {
    return {
      oneWayProp: this.oneWayProp,
      twoWayProp: this.twoWayProp,
      nestedProp: this.nestedProp,
      refProp: this.refProp,
      forwardRefProp: this.forwardRefProp,
      templateProp: this.templateProp,
      onSomething: this._onSomething,
      childrenSlot: this.childrenSlot,
      oneWayPropInit: this.oneWayPropInit,
      nestedPropInit: this.nestedPropInit,
      twoWayPropChange: this._twoWayPropChange,
    }.hasOwnProperty("oneWayProp");
  }
  get __nested(): any {
    return {
      oneWayProp: this.oneWayProp,
      twoWayProp: this.twoWayProp,
      nestedProp: this.nestedProp,
      refProp: this.refProp,
      forwardRefProp: this.forwardRefProp,
      templateProp: this.templateProp,
      onSomething: this._onSomething,
      childrenSlot: this.childrenSlot,
      oneWayPropInit: this.oneWayPropInit,
      nestedPropInit: this.nestedPropInit,
      twoWayPropChange: this._twoWayPropChange,
    }.hasOwnProperty("nestedProp");
  }
  get __onewayinit(): any {
    return {
      oneWayProp: this.oneWayProp,
      twoWayProp: this.twoWayProp,
      nestedProp: this.nestedProp,
      refProp: this.refProp,
      forwardRefProp: this.forwardRefProp,
      templateProp: this.templateProp,
      onSomething: this._onSomething,
      childrenSlot: this.childrenSlot,
      oneWayPropInit: this.oneWayPropInit,
      nestedPropInit: this.nestedPropInit,
      twoWayPropChange: this._twoWayPropChange,
    }.hasOwnProperty("oneWayPropInit");
  }
  get __nestedinit(): any {
    return {
      oneWayProp: this.oneWayProp,
      twoWayProp: this.twoWayProp,
      nestedProp: this.nestedProp,
      refProp: this.refProp,
      forwardRefProp: this.forwardRefProp,
      templateProp: this.templateProp,
      onSomething: this._onSomething,
      childrenSlot: this.childrenSlot,
      oneWayPropInit: this.oneWayPropInit,
      nestedPropInit: this.nestedPropInit,
      twoWayPropChange: this._twoWayPropChange,
    }.hasOwnProperty("nestedPropInit");
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
  private __nestedPropInit?: DxUndefWidgetNestedPropInit[];
  @ContentChildren(DxUndefWidgetNestedPropInit)
  nestedPropInitNested?: QueryList<DxUndefWidgetNestedPropInit>;
  get nestedPropInit(): DxUndefWidgetNestedPropInit[] | undefined {
    if (this.__nestedPropInit) {
      return this.__nestedPropInit;
    }
    const nested = this.nestedPropInitNested?.toArray();
    if (nested && nested.length) {
      return nested;
    }
    return WidgetProps.__defaultNestedValues.nestedPropInit;
  }
  get __restAttributes(): any {
    return {};
  }
  forwardRefPropRef?: ElementRef<any>;
  get forwardRef_forwardRefProp(): (
    ref?: ElementRef<any>
  ) => ElementRef<any> | undefined {
    if (this.__getterCache["forwardRef_forwardRefProp"] !== undefined) {
      return this.__getterCache["forwardRef_forwardRefProp"];
    }
    return (this.__getterCache["forwardRef_forwardRefProp"] = ((): ((
      ref?: ElementRef<any>
    ) => ElementRef<any> | undefined) => {
      return function (
        this: undefWidget,
        ref?: ElementRef<any>
      ): ElementRef<any> | undefined {
        if (arguments.length) {
          this.forwardRefPropRef = ref;
          this.forwardRefProp?.(ref);
        }
        return this.forwardRefProp?.();
      }.bind(this);
    })());
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    forwardRef_forwardRefProp?: (
      ref?: ElementRef<any>
    ) => ElementRef<any> | undefined;
  } = {};

  ngAfterViewInit() {
    this._detectChanges();
  }

  _onSomething: any;
  _twoWayPropChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onSomething = (e: any) => {
      this.onSomething.emit(e);
    };
    this._twoWayPropChange = (e: any) => {
      this.twoWayPropChange.emit(e);
      this._detectChanges();
    };
  }
  @Input() set nestedProp(value: DxUndefWidgetNestedProp[] | undefined) {
    this.__nestedProp = value;
    this._detectChanges();
  }
  @Input() set nestedPropInit(
    value: DxUndefWidgetNestedPropInit[] | undefined
  ) {
    this.__nestedPropInit = value;
    this._detectChanges();
  }
  @ViewChild("slotChildrenSlot") set slotChildrenSlot(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.childrenSlot;
    this.__slotChildrenSlot = slot;
    const newValue = this.childrenSlot;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
}
@NgModule({
  declarations: [
    undefWidget,
    DxUndefWidgetNestedProp,
    DxUndefWidgetNestedPropInit,
  ],
  imports: [CommonModule],

  exports: [undefWidget, DxUndefWidgetNestedProp, DxUndefWidgetNestedPropInit],
})
export class DxundefWidgetModule {}
export { undefWidget as DxundefWidgetComponent };
