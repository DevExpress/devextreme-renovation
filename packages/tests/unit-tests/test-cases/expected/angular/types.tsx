import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
  WidgetProps as ExternalWidgetProps,
} from "./types-external";
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() str: String = "";
  @Input() num: Number = 1;
  @Input() bool: Boolean = true;
  @Input() arr: Array<any> = [];
  @Input() strArr: Array<String> = ["a", "b"];
  @Input() obj: Object = {};
  @Input() date: Date = new Date();
  @Input() func: Function = () => {};
  @Input() symbol: Symbol = Symbol("x");
  @Input() externalEnum: EnumType = "data";
  @Input() externalUnion: Union = 0;
  @Input() externalObj: ObjType = { number: 0, text: "text" };
  @Input() externalArray: StringArr = ["s1", "s2"];
  @Input() externalString: StringType = "someValue";
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
    "str",
    "num",
    "bool",
    "arr",
    "strArr",
    "obj",
    "date",
    "func",
    "symbol",
    "externalEnum",
    "externalUnion",
    "externalObj",
    "externalArray",
    "externalString",
  ],
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
  widgetTemplate: TemplateRef<any>;
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

import { CustomType } from "./types-external";
class BaseViewPropsType {
  @Input() strArr: Array<String> = new WidgetProps().strArr;
  @Input() customTypeField?: { name: string; customField: CustomType }[];
}
