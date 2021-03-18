import { Input, Output, EventEmitter } from "@angular/core";
export class InnerWidgetProps {
  @Input() selected?: boolean;
  @Input() value: number = 14;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<number> = new EventEmitter();
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  forwardRef,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

const NUMBER_STYLES = new Set([
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-negative",
  "flex-order",
  "flex-positive",
  "flex-shrink",
  "flood-opacity",
  "font-weight",
  "grid-column",
  "grid-row",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
]);

const uppercasePattern = /[A-Z]/g;
const kebabCase = (str: string) => {
  return str.replace(uppercasePattern, "-$&").toLowerCase();
};

const isNumeric = (value: string | number) => {
  if (typeof value === "number") return true;
  return !isNaN(Number(value));
};

const getNumberStyleValue = (style: string, value: string | number) => {
  return NUMBER_STYLES.has(style) ? value : `${value}px`;
};

export const normalizeStyles = (styles: unknown) => {
  if (!(styles instanceof Object)) return styles;

  return Object.entries(styles).reduce(
    (result: Record<string, string | number>, [key, value]) => {
      const kebabString = kebabCase(key);
      result[kebabString] = isNumeric(value)
        ? getNumberStyleValue(kebabString, value)
        : value;
      return result;
    },
    {} as Record<string, string | number>
  );
};

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InnerWidget),
  multi: true,
};
@Component({
  selector: "dx-inner-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR_PROVIDER],
  inputs: ["selected", "value"],
  outputs: ["onSelect", "valueChange"],
  template: `<div
    [ngStyle]="__processNgStyle({ width: 100, height: 100 })"
  ></div>`,
})
export default class InnerWidget
  extends InnerWidgetProps
  implements ControlValueAccessor {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @HostListener("valueChange", ["$event"]) change() {}
  @HostListener("onBlur", ["$event"]) touched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this._detectChanges();
  }

  registerOnChange(fn: () => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  _onSelect: any;
  _valueChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onSelect = (e: any) => {
      this.onSelect.emit(e);
    };
    this._valueChange = (e: any) => {
      this.valueChange.emit(e);
      this._detectChanges();
    };
  }

  __processNgStyle(value: any) {
    return normalizeStyles(value);
  }
}
@NgModule({
  declarations: [InnerWidget],
  imports: [CommonModule],

  exports: [InnerWidget],
})
export class DxInnerWidgetModule {}
export { InnerWidget as DxInnerWidgetComponent };
