type EventCallBack<Type> = (e: Type) => void;
const device = "ios";
function isDevice() {
  return true;
}

import { Injectable, Input, Output, EventEmitter } from "@angular/core";
@Injectable()
export class WidgetInput {
  @Input() height: number = 10;
  @Input() export: object = {};
  @Input() array: any = ["1"];
  @Input() expressionDefault: string = device === "ios" ? "yes" : "no";
  @Input() expressionDefault1: boolean = !device;
  @Input() expressionDefault2: boolean | string = isDevice() || "test";
  @Input() sizes?: { height: number; width: number };
  @Input() stringValue: string = "";
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

  ngOnChanges(changes: { [name: string]: any }) {
    if (changes["height"] && changes["height"].currentValue === undefined) {
      this.height = 10;
    }
    if (changes["export"] && changes["export"].currentValue === undefined) {
      this.export = {};
    }
    if (changes["array"] && changes["array"].currentValue === undefined) {
      this.array = ["1"];
    }
    if (
      changes["expressionDefault"] &&
      changes["expressionDefault"].currentValue === undefined
    ) {
      this.expressionDefault = device === "ios" ? "yes" : "no";
    }
    if (
      changes["expressionDefault1"] &&
      changes["expressionDefault1"].currentValue === undefined
    ) {
      this.expressionDefault1 = !device;
    }
    if (
      changes["expressionDefault2"] &&
      changes["expressionDefault2"].currentValue === undefined
    ) {
      this.expressionDefault2 = isDevice() || "test";
    }
    if (
      changes["stringValue"] &&
      changes["stringValue"].currentValue === undefined
    ) {
      this.stringValue = "";
    }
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
