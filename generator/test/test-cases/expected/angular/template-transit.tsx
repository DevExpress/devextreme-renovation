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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-template-transit-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dx-widget-with-template
    [template]="templateProp"
    [componentTemplate]="componentTemplateProp"
  ></dx-widget-with-template>`,
})
export default class TemplateTransitWidget extends TemplateTransitWidgetInput {
  get __restAttributes(): any {
    return {};
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [TemplateTransitWidget],
  imports: [DxWidgetWithTemplateModule, CommonModule],
  exports: [TemplateTransitWidget],
})
export class DxTemplateTransitWidgetModule {}
