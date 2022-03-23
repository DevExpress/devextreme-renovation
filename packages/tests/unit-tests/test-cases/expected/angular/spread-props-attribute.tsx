import InnerWidget, { DxInnerWidgetModule } from './dx-inner-widget';
import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  template: '',
})
export class WidgetInput {
  @Input() visible?: boolean;
  @Input() value?: boolean;
  @Output() valueChange: EventEmitter<boolean | undefined> = new EventEmitter();
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  ElementRef,
  TemplateRef,
  forwardRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getAttributes } from '@devextreme/runtime/angular';

const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Widget),
  multi: true,
};
@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR_PROVIDER],
  inputs: ['visible', 'value'],
  outputs: ['valueChange'],
  template: `<ng-template #widgetTemplate
    ><dx-inner-widget
      #innerwidget1
      style="display: contents"
      [value]="value"
      (valueChange)="_valueChange($event)"
      #_auto_ref_0
      [_restAttributes]="__restAttributes"
    ></dx-inner-widget
    ><ng-content *ngTemplateOutlet="innerwidget1?.widgetTemplate"></ng-content
    ><div #_auto_ref_1></div
  ></ng-template>`,
})
export default class Widget
  extends WidgetInput
  implements ControlValueAccessor
{
  @Input() _restAttributes?: Record<string, unknown>;

  counter: number = 1;
  notUsedValue: number = 1;
  get __attributes(): any {
    return { visible: this.visible, value: this.counter };
  }
  get __restAttributes(): any {
    const { visible, value, valueChange, ...restAttributes } = getAttributes(
      this._elementRef
    );
    return {
      ...restAttributes,
      ...this._restAttributes,
    };
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }
  @ViewChild('_auto_ref_0', { static: false })
  _auto_ref_0?: ElementRef<HTMLDivElement>;
  @ViewChild('_auto_ref_1', { static: false })
  _auto_ref_1?: ElementRef<HTMLDivElement>;

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.__restAttributes || {};
    const _ref_0 = this._auto_ref_0?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
      }
    }

    const _attr_1: { [name: string]: any } = (this.__attributes as any) || {};
    const _ref_1 = this._auto_ref_1?.nativeElement;
    if (_ref_1) {
      for (let key in _attr_1) {
        _ref_1.setAttribute(key, _attr_1[key].toString());
      }
    }

    this._elementRef.nativeElement.removeAttribute('id');
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

  ngAfterViewInit() {
    this.__applyAttributes__();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (['visible'].some((d) => changes[d] && !changes[d].firstChange)) {
      this.scheduledApplyAttributes = true;
    }
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
  }

  _valueChange: any;
  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    super();
    this._valueChange = (e: any) => {
      this.valueChange.emit(e);

      this._detectChanges();
    };
  }
  set _counter(counter: number) {
    this.counter = counter;
    this._detectChanges();
    this.scheduledApplyAttributes = true;
  }
  set _notUsedValue(notUsedValue: number) {
    this.notUsedValue = notUsedValue;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [DxInnerWidgetModule, CommonModule],
  entryComponents: [InnerWidget],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
