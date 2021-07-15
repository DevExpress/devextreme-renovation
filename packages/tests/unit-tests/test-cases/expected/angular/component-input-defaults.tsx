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

export class WidgetProps extends BaseProps {
  @Input() text?: string = format("text");
  private __texts1__?: TextsProps;
  @Input() set texts1(value: TextsProps | undefined) {
    this.__texts1__ = value;
  }
  get texts1(): TextsProps | undefined {
    if (!this.__texts1__) {
      return WidgetProps.__defaultNestedValues.texts1;
    }
    return this.__texts1__;
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
  public static __defaultNestedValues: any = {
    texts1: { text: format("text") },
    texts2: new TextsProps(),
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
  selector: "dxo-texts2",
})
class DxWidgetTexts2 extends TextsProps {}

@Directive({
  selector: "dxo-texts1",
})
class DxWidgetTexts1 extends TextsProps {}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["text", "texts1", "texts2", "empty", "height", "width"],
  template: `<div></div>`,
})
export default class Widget extends WidgetProps {
  private __texts1?: DxWidgetTexts1;
  @ContentChildren(DxWidgetTexts1) texts1Nested?: QueryList<DxWidgetTexts1>;
  get texts1(): DxWidgetTexts1 | undefined {
    if (this.__texts1) {
      return this.__texts1;
    }
    const nested = this.texts1Nested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
    return WidgetProps.__defaultNestedValues.texts1;
  }
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
  @Input() set texts1(value: DxWidgetTexts1 | undefined) {
    this.__texts1 = value;
    this._detectChanges();
  }
  @Input() set texts2(value: DxWidgetTexts2 | undefined) {
    this.__texts2 = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget, DxWidgetTexts1, DxWidgetTexts2],
  imports: [CommonModule],

  exports: [Widget, DxWidgetTexts1, DxWidgetTexts2],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
