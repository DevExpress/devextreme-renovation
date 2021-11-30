function isMaterial() {
  return true;
}
function format(key: string) {
  return "localized_" + key;
}

import { Injectable, Input } from "@angular/core";
@Injectable()
export class BaseProps {
  @Input() empty?: string;

  __heightInternalValue?: number = 10;
  @Input()
  set height(value: number | undefined) {
    if (value !== undefined) this.__heightInternalValue = value;
    else this.__heightInternalValue = 10;
  }
  get height() {
    return this.__heightInternalValue;
  }

  __widthInternalValue?: number = isMaterial() ? 20 : 10;
  @Input()
  set width(value: number | undefined) {
    if (value !== undefined) this.__widthInternalValue = value;
    else this.__widthInternalValue = isMaterial() ? 20 : 10;
  }
  get width() {
    return this.__widthInternalValue;
  }
  private __baseNested__?: TextsProps | string;
  @Input() set baseNested(value: TextsProps | string) {
    this.__baseNested__ = value;
  }
  get baseNested(): TextsProps | string {
    if (!this.__baseNested__) {
      return BaseProps.__defaultNestedValues.baseNested;
    }
    return this.__baseNested__;
  }
  public static __defaultNestedValues: any = { baseNested: { text: "3" } };
}

@Injectable()
export class TextsProps {
  __textInternalValue?: string = format("text");
  @Input()
  set text(value: string | undefined) {
    if (value !== undefined) this.__textInternalValue = value;
    else this.__textInternalValue = format("text");
  }
  get text() {
    return this.__textInternalValue;
  }
}

@Injectable()
export class ExpressionProps {
  __expressionDefaultInternalValue?: any = isMaterial() ? 20 : 10;
  @Input()
  set expressionDefault(value: any | undefined) {
    if (value !== undefined) this.__expressionDefaultInternalValue = value;
    else this.__expressionDefaultInternalValue = isMaterial() ? 20 : 10;
  }
  get expressionDefault() {
    return this.__expressionDefaultInternalValue;
  }
}

import { TemplateRef } from "@angular/core";
@Injectable()
export class WidgetProps extends BaseProps {
  __textInternalValue?: string = format("text");
  @Input()
  set text(value: string | undefined) {
    if (value !== undefined) this.__textInternalValue = value;
    else this.__textInternalValue = format("text");
  }
  get text() {
    return this.__textInternalValue;
  }

  __texts1InternalValue?: TextsProps = { text: format("text") };
  @Input()
  set texts1(value: TextsProps | undefined) {
    if (value !== undefined) this.__texts1InternalValue = value;
    else this.__texts1InternalValue = { text: format("text") };
  }
  get texts1() {
    return this.__texts1InternalValue;
  }
  private __texts2__?: TextsProps;
  @Input() set texts2(value: TextsProps | undefined) {
    this.__texts2__ = value;
  }
  get texts2(): TextsProps | undefined {
    if (!this.__texts2__) {
      return WidgetProps.__defaultNestedValues.texts2;
    }
    return this.__texts2__;
  }
  private __texts3__?: TextsProps;
  @Input() set texts3(value: TextsProps | undefined) {
    this.__texts3__ = value;
  }
  get texts3(): TextsProps | undefined {
    if (!this.__texts3__) {
      return WidgetProps.__defaultNestedValues.texts3;
    }
    return this.__texts3__;
  }
  @Input() template?: TemplateRef<any> | null = null;
  public static __defaultNestedValues: any = {
    texts2: { text: format("text") },
    texts3: new TextsProps(),
    baseNested: BaseProps?.__defaultNestedValues.baseNested,
  };
  private __baseNestedBaseProps__?: TextsProps | string;
  @Input() set baseNested(value: TextsProps | string) {
    this.__baseNestedBaseProps__ = value;
  }
  get baseNested(): TextsProps | string {
    if (!this.__baseNestedBaseProps__) {
      return WidgetProps.__defaultNestedValues.baseNested;
    }
    return this.__baseNestedBaseProps__;
  }
}

@Injectable()
class WidgetPropsType {
  __textInternalValue?: string = new WidgetProps().text;
  @Input()
  set text(value: string | undefined) {
    if (value !== undefined) this.__textInternalValue = value;
    else this.__textInternalValue = new WidgetProps().text;
  }
  get text() {
    return this.__textInternalValue;
  }

  __texts1InternalValue?: TextsProps = new WidgetProps().texts1;
  @Input()
  set texts1(value: TextsProps | undefined) {
    if (value !== undefined) this.__texts1InternalValue = value;
    else this.__texts1InternalValue = new WidgetProps().texts1;
  }
  get texts1() {
    return this.__texts1InternalValue;
  }
  private __texts2__?: TextsProps;
  @Input() set texts2(value: TextsProps | undefined) {
    this.__texts2__ = value;
  }
  get texts2(): TextsProps | undefined {
    if (!this.__texts2__) {
      return WidgetPropsType.__defaultNestedValues.texts2;
    }
    return this.__texts2__;
  }
  private __texts3__?: TextsProps;
  @Input() set texts3(value: TextsProps | undefined) {
    this.__texts3__ = value;
  }
  get texts3(): TextsProps | undefined {
    if (!this.__texts3__) {
      return WidgetPropsType.__defaultNestedValues.texts3;
    }
    return this.__texts3__;
  }
  @Input() template?: TemplateRef<any> | null = null;
  @Input() empty?: string;

  __heightInternalValue?: number = new WidgetProps().height;
  @Input()
  set height(value: number | undefined) {
    if (value !== undefined) this.__heightInternalValue = value;
    else this.__heightInternalValue = new WidgetProps().height;
  }
  get height() {
    return this.__heightInternalValue;
  }

  __widthInternalValue?: number = new WidgetProps().width;
  @Input()
  set width(value: number | undefined) {
    if (value !== undefined) this.__widthInternalValue = value;
    else this.__widthInternalValue = new WidgetProps().width;
  }
  get width() {
    return this.__widthInternalValue;
  }
  private __baseNested__?: TextsProps | string;
  @Input() set baseNested(value: TextsProps | string) {
    this.__baseNested__ = value;
  }
  get baseNested(): TextsProps | string {
    if (!this.__baseNested__) {
      return WidgetPropsType.__defaultNestedValues.baseNested;
    }
    return this.__baseNested__;
  }

  __expressionDefaultInternalValue?: any = new ExpressionProps()
    .expressionDefault;
  @Input()
  set expressionDefault(value: any | undefined) {
    if (value !== undefined) this.__expressionDefaultInternalValue = value;
    else
      this.__expressionDefaultInternalValue =
        new ExpressionProps().expressionDefault;
  }
  get expressionDefault() {
    return this.__expressionDefaultInternalValue;
  }
  public static __defaultNestedValues: any = {
    texts2: new WidgetProps().texts2,
    texts3: new WidgetProps().texts3,
    baseNested: new WidgetProps().baseNested,
  };
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
  ContentChildren,
  QueryList,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Directive({
  selector: "dxo-base-nested",
})
class DxWidgetBaseNested extends TextsProps {}

@Directive({
  selector: "dxo-texts3",
})
class DxWidgetTexts3 extends TextsProps {}

@Directive({
  selector: "dxo-texts2",
})
class DxWidgetTexts2 extends TextsProps {}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    "text",
    "texts1",
    "texts2",
    "texts3",
    "template",
    "empty",
    "height",
    "width",
    "baseNested",
    "expressionDefault",
  ],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetPropsType {
  private __texts2?: DxWidgetTexts2;
  @ContentChildren(DxWidgetTexts2) texts2Nested?: QueryList<DxWidgetTexts2>;
  get texts2(): DxWidgetTexts2 | undefined {
    if (this.__texts2) {
      return this.__texts2;
    }
    const nested = this.texts2Nested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
    return WidgetPropsType.__defaultNestedValues.texts2;
  }
  private __texts3?: DxWidgetTexts3;
  @ContentChildren(DxWidgetTexts3) texts3Nested?: QueryList<DxWidgetTexts3>;
  get texts3(): DxWidgetTexts3 | undefined {
    if (this.__texts3) {
      return this.__texts3;
    }
    const nested = this.texts3Nested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
    return WidgetPropsType.__defaultNestedValues.texts3;
  }
  private __baseNested?: DxWidgetBaseNested | string;
  @ContentChildren(DxWidgetBaseNested)
  baseNestedNested?: QueryList<DxWidgetBaseNested>;
  get baseNested(): DxWidgetBaseNested | string {
    if (this.__baseNested) {
      return this.__baseNested;
    }
    const nested = this.baseNestedNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
    return WidgetPropsType.__defaultNestedValues.baseNested;
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

  ngAfterViewInit() {
    this._detectChanges();
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
  @Input() set texts2(value: DxWidgetTexts2 | undefined) {
    this.__texts2 = value;
    this._detectChanges();
  }
  @Input() set texts3(value: DxWidgetTexts3 | undefined) {
    this.__texts3 = value;
    this._detectChanges();
  }
  @Input() set baseNested(value: DxWidgetBaseNested | string) {
    this.__baseNested = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget, DxWidgetTexts2, DxWidgetTexts3, DxWidgetBaseNested],
  imports: [CommonModule],

  exports: [Widget, DxWidgetTexts2, DxWidgetTexts3, DxWidgetBaseNested],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
