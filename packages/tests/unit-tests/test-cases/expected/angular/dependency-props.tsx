import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  template: '',
})
export class InnerWidgetProps {
  @Input() selected?: boolean;
  @Input() value: number = 14;
  @Output() valueChange: EventEmitter<number> = new EventEmitter();
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
  forwardRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';
import { normalizeStyles } from '@devextreme/runtime/common';

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InnerWidget),
  multi: true,
};
@Component({
  selector: 'dx-inner-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR_PROVIDER],
  inputs: ['selected', 'value'],
  outputs: ['valueChange'],
  template: `<ng-template #widgetTemplate
    ><div [ngStyle]="__processNgStyle({ width: 100, height: 100 })"></div
  ></ng-template>`,
})
export default class InnerWidget
  extends InnerWidgetProps
  implements ControlValueAccessor
{
  defaultEntries: DefaultEntries;

  get __someGetter(): InnerWidgetProps {
    return {
      selected: this.selected,
      value: this.value,
      valueChange: this._valueChange,
    };
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @HostListener('valueChange', ['$event']) change() {}
  @HostListener('onBlur', ['$event']) touched = () => {};

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

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  _valueChange: any;
  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new InnerWidgetProps() as { [key: string]: any };
    this.defaultEntries = ['value'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
