export declare type EnumType = "data" | "none";
export declare type Union = string | number;
export declare type ObjType = { number: number; text: string };
export declare type StringArr = Array<String>;
export declare type StringType = String;
export declare type StrDate = string | Date;
import { Injectable, Input } from "@angular/core";
@Injectable()
export class WidgetProps {
  __dataInternalValue?: EnumType = "data";
  @Input()
  set data(value: EnumType | undefined) {
    if (value !== undefined) this.__dataInternalValue = value;
    else this.__dataInternalValue = "data";
  }
  get data() {
    return this.__dataInternalValue;
  }

  __unionInternalValue?: Union = "uniontext";
  @Input()
  set union(value: Union | undefined) {
    if (value !== undefined) this.__unionInternalValue = value;
    else this.__unionInternalValue = "uniontext";
  }
  get union() {
    return this.__unionInternalValue;
  }

  __objInternalValue?: ObjType = { number: 123, text: "sda" };
  @Input()
  set obj(value: ObjType | undefined) {
    if (value !== undefined) this.__objInternalValue = value;
    else this.__objInternalValue = { number: 123, text: "sda" };
  }
  get obj() {
    return this.__objInternalValue;
  }

  __strArrInternalValue?: StringArr = ["ba", "ab"];
  @Input()
  set strArr(value: StringArr | undefined) {
    if (value !== undefined) this.__strArrInternalValue = value;
    else this.__strArrInternalValue = ["ba", "ab"];
  }
  get strArr() {
    return this.__strArrInternalValue;
  }

  __sInternalValue?: StringType = "";
  @Input()
  set s(value: StringType | undefined) {
    if (value !== undefined) this.__sInternalValue = value;
    else this.__sInternalValue = "";
  }
  get s() {
    return this.__sInternalValue;
  }

  __strDateInternalValue?: StrDate = new Date();
  @Input()
  set strDate(value: StrDate | undefined) {
    if (value !== undefined) this.__strDateInternalValue = value;
    else this.__strDateInternalValue = new Date();
  }
  get strDate() {
    return this.__strDateInternalValue;
  }
  @Input() customTypeField?: { name: string; customField: CustomType }[];
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
  inputs: ["data", "union", "obj", "strArr", "s", "strDate", "customTypeField"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetProps {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };

export interface CustomType {
  name: string;
  value: number;
}
