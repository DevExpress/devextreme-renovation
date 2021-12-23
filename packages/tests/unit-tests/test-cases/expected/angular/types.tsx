import {
  EnumType,
  Union,
  ObjType,
  StringArr,
  StringType,
  WidgetProps as ExternalWidgetProps,
} from "./types-external";
import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

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
  defaultEntries: DefaultEntries;
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
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = [
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
    ].map((key) => ({ key, value: defaultProps[key] }));
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
@Component({
  template: "",
})
class BaseViewPropsType {
  @Input() strArr: Array<String> = new WidgetProps().strArr;
  @Input() customTypeField?: { name: string; customField: CustomType }[];
}
