import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import { Input, TemplateRef } from "@angular/core";
export class TemplateDefaultValueProps {
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() stringToRender: string = "default string";
  @Input() componentTemplate: TemplateRef<any> | null = null;
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
  selector: "dx-template-default-value",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
      >TemplateDefaultValue<ng-container
        *ngTemplateOutlet="
          contentTemplate || contentTemplateDefault;
          context: { data: { p1: stringToRender }, index: 5 }
        "
      ></ng-container
      >ComponentTemplateDefaultValue<ng-container
        *ngTemplateOutlet="
          componentTemplate || componentTemplateDefault;
          context: { value: stringToRender }
        "
      ></ng-container></div
    ><ng-template #contentTemplateDefault let-data="data" ,let-index="index"
      ><span>{{ data.p1 }}</span></ng-template
    >
    <ng-template #componentTemplateDefault let-value="value"
      ><div>{{ optionalValue || value }}</div></ng-template
    >`,
})
export default class TemplateDefaultValue extends TemplateDefaultValueProps {
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
  declarations: [TemplateDefaultValue],
  imports: [DxWidgetWithPropsModule, CommonModule],
  exports: [TemplateDefaultValue],
})
export class DxTemplateDefaultValueModule {}
export { TemplateDefaultValue as DxTemplateDefaultValueComponent };
