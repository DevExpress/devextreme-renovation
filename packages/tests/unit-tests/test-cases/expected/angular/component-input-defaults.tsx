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
  private __baseNested__?: TextsProps;
  @Input() set baseNested(value: TextsProps | undefined) {
    this.__baseNested__ = value;
  }
  get baseNested(): TextsProps | undefined {
    if (!this.__baseNested__) {
      return BaseProps.__defaultNestedValues.baseNested;
    }
    return this.__baseNested__;
  }
  public static __defaultNestedValues: any = { baseNested: new TextsProps() };
}

export class TextsProps {
  @Input() text?: string = format("text");
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
    baseNested: BaseProps?.__defaultNestedValues.baseNested,
  };
  private __baseNestedBaseProps__?: TextsProps;
  @Input() set baseNested(value: TextsProps | undefined) {
    this.__baseNestedBaseProps__ = value;
  }
  get baseNested(): TextsProps | undefined {
    if (!this.__baseNestedBaseProps__) {
      return WidgetProps.__defaultNestedValues.baseNested;
    }
    return this.__baseNestedBaseProps__;
  }
}

export class PickedProps {
  @Input() someValue?: string = format("text");
}

export class WidgetTypeProps {
  @Input() text?: string = new WidgetProps().text;
  @Input() texts1?: TextsProps = new WidgetProps().texts1;
  private __texts2__?: TextsProps;
  @Input() set texts2(value: TextsProps | undefined) {
    this.__texts2__ = value;
  }
  get texts2(): TextsProps | undefined {
    if (!this.__texts2__) {
      return WidgetTypeProps.__defaultNestedValues.texts2;
    }
    return this.__texts2__;
  }
  private __texts3__?: TextsProps;
  @Input() set texts3(value: TextsProps | undefined) {
    this.__texts3__ = value;
  }
  get texts3(): TextsProps | undefined {
    if (!this.__texts3__) {
      return WidgetTypeProps.__defaultNestedValues.texts3;
    }
    return this.__texts3__;
  }
  @Input() template?: TemplateRef<any> | null = null;
  @Input() empty?: string;
  @Input() height?: number = new WidgetProps().height;
  @Input() width?: number = new WidgetProps().width;
  private __baseNested__?: TextsProps;
  @Input() set baseNested(value: TextsProps | undefined) {
    this.__baseNested__ = value;
  }
  get baseNested(): TextsProps | undefined {
    if (!this.__baseNested__) {
      return WidgetTypeProps.__defaultNestedValues.baseNested;
    }
    return this.__baseNested__;
  }
  @Input() someValue?: string = new PickedProps().someValue;
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
  ViewRef,
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
  ],
  template: `<div></div>`,
})
export default class Widget extends WidgetProps {
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
    return WidgetProps.__defaultNestedValues.texts2;
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
    return WidgetProps.__defaultNestedValues.texts3;
  }
  private __baseNested?: DxWidgetBaseNested;
  @ContentChildren(DxWidgetBaseNested)
  baseNestedNested?: QueryList<DxWidgetBaseNested>;
  get baseNested(): DxWidgetBaseNested | undefined {
    if (this.__baseNested) {
      return this.__baseNested;
    }
    const nested = this.baseNestedNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
    return WidgetProps.__defaultNestedValues.baseNested;
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

  constructor(private changeDetection: ChangeDetectorRef) {
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
  @Input() set baseNested(value: DxWidgetBaseNested | undefined) {
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
