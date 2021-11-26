type EventCallBack<Type> = (e: Type) => void;
const device = "ios";
function isDevice() {
  return true;
}

import { Input, Output, EventEmitter } from "@angular/core";
export class WidgetInput {
  __heightInternalValue?: number = 10;
  @Input()
  set height(value: number | undefined) {
    if (value !== undefined) this.__heightInternalValue = value;
    else this.__heightInternalValue = 10;
  }
  get height() {
    return this.__heightInternalValue;
  }

  __exportInternalValue?: object = {};
  @Input()
  set export(value: object | undefined) {
    if (value !== undefined) this.__exportInternalValue = value;
    else this.__exportInternalValue = {};
  }
  get export() {
    return this.__exportInternalValue;
  }

  __arrayInternalValue?: any = ["1"];
  @Input()
  set array(value: any | undefined) {
    if (value !== undefined) this.__arrayInternalValue = value;
    else this.__arrayInternalValue = ["1"];
  }
  get array() {
    return this.__arrayInternalValue;
  }

  __expressionDefaultInternalValue?: string = device === "ios" ? "yes" : "no";
  @Input()
  set expressionDefault(value: string | undefined) {
    if (value !== undefined) this.__expressionDefaultInternalValue = value;
    else
      this.__expressionDefaultInternalValue = device === "ios" ? "yes" : "no";
  }
  get expressionDefault() {
    return this.__expressionDefaultInternalValue;
  }

  __expressionDefault1InternalValue?: boolean = !device;
  @Input()
  set expressionDefault1(value: boolean | undefined) {
    if (value !== undefined) this.__expressionDefault1InternalValue = value;
    else this.__expressionDefault1InternalValue = !device;
  }
  get expressionDefault1() {
    return this.__expressionDefault1InternalValue;
  }

  __expressionDefault2InternalValue?: boolean | string = isDevice() || "test";
  @Input()
  set expressionDefault2(value: boolean | string | undefined) {
    if (value !== undefined) this.__expressionDefault2InternalValue = value;
    else this.__expressionDefault2InternalValue = isDevice() || "test";
  }
  get expressionDefault2() {
    return this.__expressionDefault2InternalValue;
  }
  @Input() sizes?: { height: number; width: number };

  __stringValueInternalValue?: string = "";
  @Input()
  set stringValue(value: string | undefined) {
    if (value !== undefined) this.__stringValueInternalValue = value;
    else this.__stringValueInternalValue = "";
  }
  get stringValue() {
    return this.__stringValueInternalValue;
  }
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  @Output() onSomething: EventEmitter<any> = new EventEmitter();
  @Output() stringValueChange: EventEmitter<string> = new EventEmitter();
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    "height",
    "export",
    "array",
    "expressionDefault",
    "expressionDefault1",
    "expressionDefault2",
    "sizes",
    "stringValue",
  ],
  outputs: ["onClick", "onSomething", "stringValueChange"],
  template: `<ng-template #widgetTemplate
    ><span
      >{{ (sizes ?? { width: 0, height: 0 }).height
      }}{{ (sizes ?? { width: 0, height: 0 }).width }}</span
    ></ng-template
  >`,
})
export default class Widget extends WidgetInput {
  __getHeight(): number {
    this._onClick(10);
    this._onClick(11);
    return this.height;
  }
  __getRestProps(): { export: object; onSomething: EventCallBack<number> } {
    const { height, onClick, ...rest } = {
      height: this.height,
      export: this.export,
      array: this.array,
      expressionDefault: this.expressionDefault,
      expressionDefault1: this.expressionDefault1,
      expressionDefault2: this.expressionDefault2,
      sizes: this.sizes,
      stringValue: this.stringValue,
      onClick: this._onClick,
      onSomething: this._onSomething,
      stringValueChange: this._stringValueChange,
    };
    return rest;
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

  _onClick: any;
  _onSomething: any;
  _stringValueChange: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
    this._onSomething = (e: any) => {
      this.onSomething.emit(e);
    };
    this._stringValueChange = (e: any) => {
      this.stringValueChange.emit(e);
      this._detectChanges();
    };
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
