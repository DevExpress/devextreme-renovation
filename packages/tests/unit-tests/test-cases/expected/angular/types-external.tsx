export declare type EnumType = "data" | "none";
export declare type Union = string | number;
export declare type ObjType = { number: number; text: string };
export declare type StringArr = Array<String>;
export declare type StringType = String;
export declare type StrDate = string | Date;
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() data: EnumType = "data";
  @Input() union: Union = "uniontext";
  @Input() obj: ObjType = { number: 123, text: "sda" };
  @Input() strArr: StringArr = ["ba", "ab"];
  @Input() s: StringType = "";
  @Input() strDate: StrDate = new Date();
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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["data", "union", "obj", "strArr", "s", "strDate", "customTypeField"],
  template: `<div></div>`,
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

  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
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
