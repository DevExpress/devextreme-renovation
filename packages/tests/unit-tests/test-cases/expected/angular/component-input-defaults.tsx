function isMaterial() {
  return true;
}
function format(key: string) {
  return "localized_" + key;
}

import { Input } from "@angular/core";
export class BaseProps {
  @Input() empty?: string;
  @Input() height?: number = 10;
  @Input() width?: number = isMaterial() ? 20 : 10;
}

export class TextsProps {
  @Input() text?: string = format("text");
}

export class ExpressionProps {
  @Input() expressionDefault?: any = isMaterial() ? 20 : 10;
}

import { TemplateRef } from "@angular/core";
export class WidgetProps extends BaseProps {
  @Input() text?: string = format("text");
  @Input() texts1?: TextsProps = { text: format("text") };
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
  };
}

class WidgetPropsType {
  @Input() text?: string = new WidgetProps().text;
  @Input() texts1?: TextsProps = new WidgetProps().texts1;
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
  @Input() height?: number = new WidgetProps().height;
  @Input() width?: number = new WidgetProps().width;
  @Input() expressionDefault?: any = new ExpressionProps().expressionDefault;
  public static __defaultNestedValues: any = {
    texts2: new WidgetProps().texts2,
    texts3: new WidgetProps().texts3,
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

  @ViewChild("widgetTemplate", { static: false })
  widgetTemplate: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
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
}

@NgModule({
  declarations: [Widget, DxWidgetTexts2, DxWidgetTexts3],
  imports: [CommonModule],

  exports: [Widget, DxWidgetTexts2, DxWidgetTexts3],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
