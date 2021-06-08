import { Input, Output, EventEmitter } from "@angular/core";
export class NestedProps {
  @Input() oneWay?: boolean = false;
  @Input() twoWay?: boolean = false;
  @Output() twoWayChange: EventEmitter<boolean | undefined> =
    new EventEmitter();
}

export class WidgetProps {
  private __nested__?: NestedProps;
  @Input() set nested(value: NestedProps | undefined) {
    this.__nested__ = value;
  }
  get nested(): NestedProps | undefined {
    return this.__nested__;
  }
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
import {
  convertRulesToOptions,
  Rule,
} from "../../../../jquery-helpers/default_options";

@Directive({
  selector: "dxo-nested",
})
class DxWidgetNested extends NestedProps {}

type WidgetOptionRule = Rule<Partial<WidgetProps>>;

const __defaultOptionRules: WidgetOptionRule[] = [
  { device: true, options: { nested: { oneWay: true } } },
];
export function defaultOptions(rule: WidgetOptionRule) {
  __defaultOptionRules.push(rule);
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["nested"],
  template: `<div></div>`,
})
export default class Widget extends WidgetProps {
  private __nested?: DxWidgetNested;
  @ContentChildren(DxWidgetNested) nestedNested?: QueryList<DxWidgetNested>;
  get nested(): DxWidgetNested | undefined {
    if (this.__nested) {
      return this.__nested;
    }
    const nested = this.nestedNested?.toArray();
    if (nested && nested.length) {
      return nested[0];
    }
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

    const defaultOptions =
      convertRulesToOptions<WidgetProps>(__defaultOptionRules);
    Object.keys(defaultOptions).forEach((option) => {
      (this as any)[option] = (defaultOptions as any)[option];
    });
  }
  @Input() set nested(value: DxWidgetNested | undefined) {
    this.__nested = value;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget, DxWidgetNested],
  imports: [CommonModule],

  exports: [Widget, DxWidgetNested],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
