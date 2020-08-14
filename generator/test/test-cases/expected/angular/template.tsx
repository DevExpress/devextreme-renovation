import { Input, TemplateRef } from "@angular/core";
export class WidgetInput {
  @Input() someProp: boolean = false;
  @Input() headerTemplate?: TemplateRef<any> | null = null;
  @Input() template: TemplateRef<any> | null = null;
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() footerTemplate: TemplateRef<any> | null = null;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container
    ><ng-container *ngIf="contentTemplate">
      <ng-container
        *ngTemplateOutlet="
          contentTemplate;
          context: { data: { p1: 'value' }, index: 10 }
        "
      ></ng-container> </ng-container
    ><ng-container *ngIf="!contentTemplate">
      <ng-container
        *ngTemplateOutlet="
          template;
          context: {
            textProp: 'textPropValue',
            textPropExpr: 'textPropExrpValue'
          }
        "
      ></ng-container> </ng-container
    ><ng-container
      *ngTemplateOutlet="footerTemplate; context: { someProp: someProp }"
    ></ng-container>
  </div>`,
})
export default class Widget extends WidgetInput {
  get __restAttributes(): any {
    return {};
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
