import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
  WidgetProps as ExternalWidgetProps,
} from "./types-external";
import { Injectable, Input } from "@angular/core";
@Injectable()
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
    if (changes["str"] && changes["str"].currentValue === undefined) {
      this.str = this.propsDefaults.str;
    }
    if (changes["num"] && changes["num"].currentValue === undefined) {
      this.num = this.propsDefaults.num;
    }
    if (changes["bool"] && changes["bool"].currentValue === undefined) {
      this.bool = this.propsDefaults.bool;
    }
    if (changes["arr"] && changes["arr"].currentValue === undefined) {
      this.arr = this.propsDefaults.arr;
    }
    if (changes["strArr"] && changes["strArr"].currentValue === undefined) {
      this.strArr = this.propsDefaults.strArr;
    }
    if (changes["obj"] && changes["obj"].currentValue === undefined) {
      this.obj = this.propsDefaults.obj;
    }
    if (changes["date"] && changes["date"].currentValue === undefined) {
      this.date = this.propsDefaults.date;
    }
    if (changes["func"] && changes["func"].currentValue === undefined) {
      this.func = this.propsDefaults.func;
    }
    if (changes["symbol"] && changes["symbol"].currentValue === undefined) {
      this.symbol = this.propsDefaults.symbol;
    }
    if (
      changes["externalEnum"] &&
      changes["externalEnum"].currentValue === undefined
    ) {
      this.externalEnum = this.propsDefaults.externalEnum;
    }
    if (
      changes["externalUnion"] &&
      changes["externalUnion"].currentValue === undefined
    ) {
      this.externalUnion = this.propsDefaults.externalUnion;
    }
    if (
      changes["externalObj"] &&
      changes["externalObj"].currentValue === undefined
    ) {
      this.externalObj = this.propsDefaults.externalObj;
    }
    if (
      changes["externalArray"] &&
      changes["externalArray"].currentValue === undefined
    ) {
      this.externalArray = this.propsDefaults.externalArray;
    }
    if (
      changes["externalString"] &&
      changes["externalString"].currentValue === undefined
    ) {
      this.externalString = this.propsDefaults.externalString;
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

import { CustomType } from "./types-external";
@Injectable()
class BaseViewPropsType {
  @Input() strArr: Array<String> = new WidgetProps().strArr;
  @Input() customTypeField?: { name: string; customField: CustomType }[];
}
