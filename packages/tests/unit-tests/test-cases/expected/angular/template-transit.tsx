import WidgetWithTemplate, {
  DxWidgetWithTemplateModule,
} from "./dx-widget-with-template";

import { Input, TemplateRef } from "@angular/core";
export class TemplateTransitWidgetInput {
  @Input() templateProp?: TemplateRef<any> | null = null;
  @Input() componentTemplateProp?: TemplateRef<any> | null = null;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-template-transit-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["templateProp", "componentTemplateProp"],
  template: `<dx-widget-with-template
      [template]="templateProp"
      [componentTemplate]="componentTemplateProp"
      #widgetwithtemplate7
    ></dx-widget-with-template
    ><ng-content
      *ngTemplateOutlet="widgetwithtemplate7.widgetTemplate"
    ></ng-content>`,
})
export default class TemplateTransitWidget extends TemplateTransitWidgetInput {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [TemplateTransitWidget],
  imports: [DxWidgetWithTemplateModule, CommonModule],
  entryComponents: [WidgetWithTemplate],
  exports: [TemplateTransitWidget],
})
export class DxTemplateTransitWidgetModule {}
export { TemplateTransitWidget as DxTemplateTransitWidgetComponent };
