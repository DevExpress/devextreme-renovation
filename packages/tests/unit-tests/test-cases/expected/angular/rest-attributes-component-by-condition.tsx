import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import {
  PublicWidgetWithProps,
  DxPublicWidgetWithPropsModule,
} from "./dx-public-widget-with-props";
import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
class ComponentWithRestInput {
  @Input() isPublic: boolean = false;
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
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  getAttributes,
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-component-with-rest",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["isPublic"],
  template: `<ng-template #widgetTemplate
    ><ng-container *ngIf="isPublic"
      ><dx-public-widget-with-props
        #publicwidgetwithprops1
        style="display: contents"
        [_private]="true"
        #_auto_ref_0
        [_restAttributes]="__restAttributes"
        style="display: contents"
        [_private]="true"
      ></dx-public-widget-with-props
      ><ng-content
        *ngTemplateOutlet="publicwidgetwithprops1?.widgetTemplate"
      ></ng-content
    ></ng-container>
    <ng-container *ngIf="!isPublic"
      ><dx-widget-with-props
        #widgetwithprops1
        style="display: contents"
        #_auto_ref_1
        [_restAttributes]="__restAttributes"
        style="display: contents"
      ></dx-widget-with-props
      ><ng-content
        *ngTemplateOutlet="widgetwithprops1?.widgetTemplate"
      ></ng-content></ng-container
  ></ng-template>`,
})
export default class ComponentWithRest extends ComponentWithRestInput {
  defaultEntries: DefaultEntries;
  @Input() _restAttributes?: Record<string, unknown>;

  get __restAttributes(): any {
    const { isPublic, ...restAttributes } = getAttributes(this._elementRef);
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

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
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
    const defaultProps = new ComponentWithRestInput() as { [key: string]: any };
    this.defaultEntries = ["isPublic"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
}
@NgModule({
  declarations: [ComponentWithRest],
  imports: [
    DxWidgetWithPropsModule,
    DxPublicWidgetWithPropsModule,
    CommonModule,
  ],
  entryComponents: [WidgetWithProps, PublicWidgetWithProps],
  exports: [ComponentWithRest],
})
export class DxComponentWithRestModule {}
export { ComponentWithRest as DxComponentWithRestComponent };
