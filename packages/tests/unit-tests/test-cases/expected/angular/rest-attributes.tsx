import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
class WidgetInput {
  @Input() id?: string;
  @Input() export?: {};
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
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { getAttributes } from "@devextreme/runtime/angular";

@Component({
  selector: "dx-component-with-rest",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["id", "export"],
  template: `<ng-template #widgetTemplate
    ><div #_auto_ref_0></div
  ></ng-template>`,
})
export default class ComponentWithRest extends WidgetInput {
  @Input() _restAttributes?: Record<string, unknown>;

  get __restAttributes(): any {
    const {
      id,
      export: exportProp,
      ...restAttributes
    } = getAttributes(this._elementRef);
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

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.__restAttributes || {};
    const _ref_0 = this._auto_ref_0?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
      }
    }

    this._elementRef.nativeElement.removeAttribute("id");
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
  imports: [CommonModule],

  exports: [ComponentWithRest],
})
export class DxComponentWithRestModule {}
export { ComponentWithRest as DxComponentWithRestComponent };
