import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import { Component } from "@angular/core";
@Component({
  template: "",
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
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { getAttributes } from "@devextreme/runtime/angular";

@Component({
  selector: "dx-component-with-rest",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><dx-widget-with-props
      #widgetRef
      style="display: contents"
      #_auto_ref_0
    ></dx-widget-with-props
    ><ng-content *ngTemplateOutlet="widgetRef?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class ComponentWithRest extends WidgetInput {
  @ViewChild("widgetRef", { static: false }) widgetRef!: WidgetWithProps;
  get __restAttributes(): any {
    const { ...restAttributes } = getAttributes(this._elementRef);
    return restAttributes;
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.__restAttributes || {};
    const _ref_0 = this.widgetRef?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
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
  declarations: [ComponentWithRest],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [ComponentWithRest],
})
export class DxComponentWithRestModule {}
export { ComponentWithRest as DxComponentWithRestComponent };
