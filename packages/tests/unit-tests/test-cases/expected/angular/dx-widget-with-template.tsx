import { Component, Input, TemplateRef } from "@angular/core";
@Component({
  template: "",
})
export class WidgetWithTemplateInput {
  @Input() template?: TemplateRef<any> | null = null;
  @Input() componentTemplate?: TemplateRef<any> | null = null;
  @Input() arrowTemplate?: TemplateRef<any> | null = null;
  @Input() typedTemplate?: TemplateRef<any> | null = null;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["template", "componentTemplate", "arrowTemplate", "typedTemplate"],
  template: `<ng-template #widgetTemplate
    ><div
      ><ng-container *ngTemplateOutlet="componentTemplate"></ng-container
      ><ng-container *ngTemplateOutlet="template"></ng-container
      ><ng-container *ngTemplateOutlet="arrowTemplate"></ng-container></div
  ></ng-template>`,
})
export default class WidgetWithTemplate extends WidgetWithTemplateInput {
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [WidgetWithTemplate],
  imports: [CommonModule],

  exports: [WidgetWithTemplate],
})
export class DxWidgetWithTemplateModule {}
export { WidgetWithTemplate as DxWidgetWithTemplateComponent };
