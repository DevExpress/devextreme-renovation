import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import {
  PublicWidgetWithProps,
  DxPublicWidgetWithPropsModule,
} from "./dx-public-widget-with-props";
import { Component } from "@angular/core";
@Component({
  template: "",
})
export class WidgetWithNestedWidgetsProps {}

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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-nested-widgets",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
      ><div
        ><dx-widget-with-props
          value="private widget"
          #widgetwithprops1
          style="display: contents"
        ></dx-widget-with-props
        ><ng-content
          *ngTemplateOutlet="widgetwithprops1?.widgetTemplate"
        ></ng-content
        ><dx-public-widget-with-props
          value="public widget"
          #publicwidgetwithprops1
          style="display: contents"
          [_private]="true"
        ></dx-public-widget-with-props
        ><ng-content
          *ngTemplateOutlet="publicwidgetwithprops1?.widgetTemplate"
        ></ng-content></div
    ></ng-template>
    <ng-container
      *ngTemplateOutlet="_private ? null : widgetTemplate"
    ></ng-container>`,
})
export default class WidgetWithNestedWidgets extends WidgetWithNestedWidgetsProps {
  @Input() _private = false;
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  scheduledApplyAttributes = false;
  __applyAttributes__() {
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
  declarations: [WidgetWithNestedWidgets],
  imports: [
    DxWidgetWithPropsModule,
    DxPublicWidgetWithPropsModule,
    CommonModule,
  ],
  entryComponents: [WidgetWithProps, PublicWidgetWithProps],
  exports: [WidgetWithNestedWidgets],
})
export class DxWidgetWithNestedWidgetsModule {}
export { WidgetWithNestedWidgets as DxWidgetWithNestedWidgetsComponent };
