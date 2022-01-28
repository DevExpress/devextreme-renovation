import InnerWidget, { DxInnerWidgetModule } from "./dx-inner-widget";
import { Component } from "@angular/core";
@Component({
  template: "",
})
export class WidgetInput {}

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
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { getAttributes } from "@devextreme/runtime/angular";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><dx-inner-widget
      #innerwidget1
      style="display: contents"
      [selected]="__attr1.selected !== undefined ? __attr1.selected : false"
      [value]="__attr1.value"
      (onSelect)="__attr1.onSelect($event)"
      (valueChange)="__attr1.valueChange($event)"
      #_auto_ref_0
      [_restAttributes]="__attr1"
    ></dx-inner-widget
    ><ng-content *ngTemplateOutlet="innerwidget1?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
  @Input() _restAttributes?: Record<string, unknown>;
  get __attr1(): any {
    return { value: 100, selected: true };
  }
  get __restAttributes(): any {
    const restAttributes = getAttributes(this._elementRef);
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
  @ViewChild("_auto_ref_0", { static: false })
  _auto_ref_0?: ElementRef<HTMLDivElement>;
  @ViewChild("_auto_ref_0", { static: false })
  _auto_ref_0?: ElementRef<HTMLDivElement>;

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.__attr1 || {};
    const _ref_0 = this._auto_ref_0?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
      }
    }

    const _attr_1: { [name: string]: any } = this.__restAttributes || {};
    const _ref_1 = this._auto_ref_0?.nativeElement;
    if (_ref_1) {
      for (let key in _attr_1) {
        _ref_1.setAttribute(key, _attr_1[key].toString());
      }
    }
  }

  ngAfterViewInit() {
    this.__applyAttributes__();
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    super();
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
