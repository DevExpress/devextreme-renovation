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
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    ><ng-container *ngTemplateOutlet="headerTemplate"></ng-container
    ><ng-container *ngIf="contentTemplate">
      <ng-container
        *ngTemplateOutlet="
          contentTemplate || contentTemplateDefault;
          context: { data: { p1: 'value' }, index: 10 }
        "
      ></ng-container>
      <ng-template #contentTemplateDefault let-data="data" let-index="index"
        ><div>{{ data.p1 }}</div></ng-template
      > </ng-container
    ><ng-container *ngIf="!contentTemplate">
      <ng-container
        *ngTemplateOutlet="
          template || templateDefault;
          context: {
            textProp: 'textPropValue',
            textPropExpr: 'textPropExrpValue'
          }
        "
      ></ng-container>
      <ng-template
        #templateDefault
        let-textProp="textProp"
        let-textPropExpr="textPropExpr"
        ><div></div
      ></ng-template> </ng-container
    ><ng-container
      *ngTemplateOutlet="
        footerTemplate || footerTemplateDefault;
        context: { someProp: someProp }
      "
    ></ng-container>
    <ng-template #footerTemplateDefault let-someProp="someProp"
      ><div></div></ng-template
  ></div>`,
})
export default class Widget extends WidgetInput {
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
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
