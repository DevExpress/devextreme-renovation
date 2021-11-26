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
  __strInternalValue: String = "";
  @Input()
  set str(value: String) {
    if (value !== undefined) this.__strInternalValue = value;
    else this.__strInternalValue = "";
  }
  get str() {
    return this.__strInternalValue;
  }

  __numInternalValue: Number = 1;
  @Input()
  set num(value: Number) {
    if (value !== undefined) this.__numInternalValue = value;
    else this.__numInternalValue = 1;
  }
  get num() {
    return this.__numInternalValue;
  }

  __boolInternalValue: Boolean = true;
  @Input()
  set bool(value: Boolean) {
    if (value !== undefined) this.__boolInternalValue = value;
    else this.__boolInternalValue = true;
  }
  get bool() {
    return this.__boolInternalValue;
  }

  __arrInternalValue: Array<any> = [];
  @Input()
  set arr(value: Array<any>) {
    if (value !== undefined) this.__arrInternalValue = value;
    else this.__arrInternalValue = [];
  }
  get arr() {
    return this.__arrInternalValue;
  }

  __strArrInternalValue: Array<String> = ["a", "b"];
  @Input()
  set strArr(value: Array<String>) {
    if (value !== undefined) this.__strArrInternalValue = value;
    else this.__strArrInternalValue = ["a", "b"];
  }
  get strArr() {
    return this.__strArrInternalValue;
  }

  __objInternalValue: Object = {};
  @Input()
  set obj(value: Object) {
    if (value !== undefined) this.__objInternalValue = value;
    else this.__objInternalValue = {};
  }
  get obj() {
    return this.__objInternalValue;
  }

  __dateInternalValue: Date = new Date();
  @Input()
  set date(value: Date) {
    if (value !== undefined) this.__dateInternalValue = value;
    else this.__dateInternalValue = new Date();
  }
  get date() {
    return this.__dateInternalValue;
  }

  __funcInternalValue: Function = () => {};
  @Input()
  set func(value: Function) {
    if (value !== undefined) this.__funcInternalValue = value;
    else this.__funcInternalValue = () => {};
  }
  get func() {
    return this.__funcInternalValue;
  }

  __symbolInternalValue: Symbol = Symbol("x");
  @Input()
  set symbol(value: Symbol) {
    if (value !== undefined) this.__symbolInternalValue = value;
    else this.__symbolInternalValue = Symbol("x");
  }
  get symbol() {
    return this.__symbolInternalValue;
  }

  __externalEnumInternalValue: EnumType = "data";
  @Input()
  set externalEnum(value: EnumType) {
    if (value !== undefined) this.__externalEnumInternalValue = value;
    else this.__externalEnumInternalValue = "data";
  }
  get externalEnum() {
    return this.__externalEnumInternalValue;
  }

  __externalUnionInternalValue: Union = 0;
  @Input()
  set externalUnion(value: Union) {
    if (value !== undefined) this.__externalUnionInternalValue = value;
    else this.__externalUnionInternalValue = 0;
  }
  get externalUnion() {
    return this.__externalUnionInternalValue;
  }

  __externalObjInternalValue: ObjType = { number: 0, text: "text" };
  @Input()
  set externalObj(value: ObjType) {
    if (value !== undefined) this.__externalObjInternalValue = value;
    else this.__externalObjInternalValue = { number: 0, text: "text" };
  }
  get externalObj() {
    return this.__externalObjInternalValue;
  }

  __externalArrayInternalValue: StringArr = ["s1", "s2"];
  @Input()
  set externalArray(value: StringArr) {
    if (value !== undefined) this.__externalArrayInternalValue = value;
    else this.__externalArrayInternalValue = ["s1", "s2"];
  }
  get externalArray() {
    return this.__externalArrayInternalValue;
  }

  __externalStringInternalValue: StringType = "someValue";
  @Input()
  set externalString(value: StringType) {
    if (value !== undefined) this.__externalStringInternalValue = value;
    else this.__externalStringInternalValue = "someValue";
  }
  get externalString() {
    return this.__externalStringInternalValue;
  }
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
class BaseViewPropsType {
  __strArrInternalValue: Array<String> = new WidgetProps().strArr;
  @Input()
  set strArr(value: Array<String>) {
    if (value !== undefined) this.__strArrInternalValue = value;
    else this.__strArrInternalValue = new WidgetProps().strArr;
  }
  get strArr() {
    return this.__strArrInternalValue;
  }
  @Input() customTypeField?: { name: string; customField: CustomType }[];
}
