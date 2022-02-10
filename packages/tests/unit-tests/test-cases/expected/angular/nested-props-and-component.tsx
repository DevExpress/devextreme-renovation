import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class FakeNested {
  @Input() numberProp: number = 2;
}

import {
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { isSlotEmpty } from "@devextreme/runtime/angular";
@Component({
  template: "",
})
export class WidgetProps {
  @Input() oneWayProp?: number;
  @Input() twoWayProp?: number;
  @Output() someEvent: EventEmitter<void> = new EventEmitter();
  @Input() someRef?: any;
  @Input() someForwardRef?: (
    ref?: ElementRef<any>
  ) => ElementRef<any> | undefined;
  __slotSlotProp?: ElementRef<HTMLDivElement>;
  get slotProp(): boolean {
    return !isSlotEmpty(this.__slotSlotProp);
  }
  @Input() templateProp?: TemplateRef<any> | null = null;
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
  @Output() twoWayPropChange: EventEmitter<number | undefined> =
    new EventEmitter();
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ContentChildren,
  QueryList,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { UndefinedNativeElementRef } from "@devextreme/runtime/angular";

@Directive({
  selector: "dxi-another-nested-prop-init",
})
export class DxUndefWidgetAnotherNestedPropInit extends FakeNested {}

@Directive({
  selector: "dxi-nested-prop",
})
export class DxUndefWidgetNestedProp extends FakeNested {}

@Component({
  selector: "dx-undef-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    "oneWayProp",
    "twoWayProp",
    "someRef",
    "someForwardRef",
    "templateProp",
    "nestedProp",
    "anotherNestedPropInit",
  ],
  outputs: ["someEvent", "twoWayPropChange"],
  template: `<ng-template #widgetTemplate
    ><div></div
    ><ng-template #dxslotProp
      ><ng-content select="[data-slotprop]"></ng-content></ng-template
  ></ng-template>`,
})
export default class UndefWidget extends WidgetProps {
  get __oneway(): any {
    return this.hasOwnProperty("oneWayProp");
  }
  get __twoway(): any {
    return this.hasOwnProperty("twoWayProp");
  }
  get __someevent(): any {
    return this.hasOwnProperty("someEvent");
  }
  get __someref(): any {
    return this.hasOwnProperty("someRef");
  }
  get __someforwardref(): any {
    return this.hasOwnProperty("someForwardRef");
  }
  get __someslot(): any {
    return this.hasOwnProperty("slotProp");
  }
  get __sometemplate(): any {
    return this.hasOwnProperty("templateProp");
  }
  get __nested(): any {
    return this.hasOwnProperty("__nestedProp") || this.nestedProp !== undefined;
  }
  get __nestedinit(): any {
    return (
      this.hasOwnProperty("__anotherNestedPropInit") ||
      this.anotherNestedPropInit !== undefined
    );
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
  someForwardRef__Ref__?: ElementRef<any>;
  get forwardRef_someForwardRef(): (
    ref?: ElementRef<any>
  ) => ElementRef<any> | undefined {
    if (this.__getterCache["forwardRef_someForwardRef"] !== undefined) {
      return this.__getterCache["forwardRef_someForwardRef"];
    }
    return (this.__getterCache["forwardRef_someForwardRef"] = ((): ((
      ref?: ElementRef<any>
    ) => ElementRef<any> | undefined) => {
      return function (
        this: UndefWidget,
        ref?: ElementRef<any>
      ): ElementRef<any> | undefined {
        if (arguments.length) {
          if (ref) {
            this.someForwardRef__Ref__ = ref;
          } else {
            this.someForwardRef__Ref__ = new UndefinedNativeElementRef();
          }
          this.someForwardRef?.(this.someForwardRef__Ref__);
        }
        return this.someForwardRef?.();
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
    forwardRef_someForwardRef?: (
      ref?: ElementRef<any>
    ) => ElementRef<any> | undefined;
  } = {};

  ngAfterViewInit() {
    this._detectChanges();
  }

  _someEvent: any;
  _twoWayPropChange: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    this._someEvent = (e: any) => {
      this.someEvent.emit(e);
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
  @Input() set anotherNestedPropInit(
    value: DxUndefWidgetAnotherNestedPropInit[]
  ) {
    this.__anotherNestedPropInit = value;
    this._detectChanges();
  }
  @ViewChild("slotSlotProp") set slotSlotProp(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.slotProp;
    this.__slotSlotProp = slot;
    const newValue = this.slotProp;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
}
@NgModule({
  declarations: [
    UndefWidget,
    DxUndefWidgetNestedProp,
    DxUndefWidgetAnotherNestedPropInit,
  ],
  imports: [CommonModule],

  exports: [
    UndefWidget,
    DxUndefWidgetNestedProp,
    DxUndefWidgetAnotherNestedPropInit,
  ],
})
export class DxUndefWidgetModule {}
export { UndefWidget as DxUndefWidgetComponent };
