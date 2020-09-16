import { Input, TemplateRef } from "@angular/core";
export class WidgetWithTemplateInput {
  @Input() template?: TemplateRef<any> | null = null;
  @Input() componentTemplate?: TemplateRef<any> | null = null;
  @Input() arrowTemplate?: TemplateRef<any> | null = null;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-template",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    ><ng-container *ngTemplateOutlet="componentTemplate"></ng-container
    ><ng-container *ngTemplateOutlet="template"></ng-container
    ><ng-container *ngTemplateOutlet="arrowTemplate"></ng-container
  ></div>`,
})
export default class WidgetWithTemplate extends WidgetWithTemplateInput {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
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
export { WidgetWithTemplate as DxWidgetWithTemplateComponent };
