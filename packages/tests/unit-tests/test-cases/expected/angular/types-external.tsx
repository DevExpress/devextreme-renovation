export declare type EnumType = "data" | "none";
export declare type Union = string | number;
export declare type ObjType = { number: number; text: string };
export declare type StringArr = Array<String>;
export declare type StringType = String;
export declare type StrDate = string | Date;
import { Injectable, Input } from "@angular/core";
@Injectable()
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
  propsDefaults = new WidgetProps();
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
    if (changes["data"] && changes["data"].currentValue === undefined) {
      this.data = this.propsDefaults.data;
    }
    if (changes["union"] && changes["union"].currentValue === undefined) {
      this.union = this.propsDefaults.union;
    }
    if (changes["obj"] && changes["obj"].currentValue === undefined) {
      this.obj = this.propsDefaults.obj;
    }
    if (changes["strArr"] && changes["strArr"].currentValue === undefined) {
      this.strArr = this.propsDefaults.strArr;
    }
    if (changes["s"] && changes["s"].currentValue === undefined) {
      this.s = this.propsDefaults.s;
    }
    if (changes["strDate"] && changes["strDate"].currentValue === undefined) {
      this.strDate = this.propsDefaults.strDate;
    }
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
