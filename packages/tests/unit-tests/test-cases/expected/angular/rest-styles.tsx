const modifyStyles = (styles: any) => {
  return { height: '100px', ...styles };
};
import { Component } from '@angular/core';
@Component({
  template: '',
})
class WidgetInput {}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
  ElementRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { getAttributes } from '@devextreme/runtime/angular';
import { normalizeStyles } from '@devextreme/runtime/common';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><span [ngStyle]="__processNgStyle(__styles)"></span
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
  @Input() _restAttributes?: Record<string, unknown>;

  get __styles(): any {
    const { style } = this.__restAttributes;
    return modifyStyles(style);
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

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    super();
  }

  __processNgStyle(value: any) {
    return normalizeStyles(value);
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
