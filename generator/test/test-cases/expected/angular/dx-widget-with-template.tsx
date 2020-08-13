import { Input, TemplateRef } from "@angular/core";
export class WidgetWithTemplateInput {
  @Input() template?: TemplateRef<any> | null = null;
  @Input() componentTemplate?: TemplateRef<any> | null = null;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <ng-container *ngTemplateOutlet="componentTemplate"></ng-container
    ><ng-container *ngTemplateOutlet="template"></ng-container>
  </div>`,
})
export default class WidgetWithTemplate extends WidgetWithTemplateInput {
  get __restAttributes(): any {
    return {};
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [WidgetWithTemplate],
  imports: [CommonModule],
  exports: [WidgetWithTemplate],
})
export class DxWidgetWithTemplateModule {}
