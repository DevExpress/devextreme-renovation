import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import { Input, TemplateRef } from "@angular/core";
export class TemplateDefaultValueProps {
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() stringToRender: string = "default string";
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
          context: { value: stringToRender, number: 21 }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          contentTemplate || contentTemplateDefault;
          context: { value: '' }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          contentTemplate || contentTemplateDefault;
          context: { value: '', optionalValue: 'optional' + stringToRender }
        "
      >
      </ng-container></div
    ><ng-template
      #contentTemplateDefault
      let-value="value"
      let-number="number"
      let-optionalValue="optionalValue"
      ><dx-widget-with-props
        [value]="value !== undefined ? value : WidgetWithPropsDefaults.value"
        [number]="
          number !== undefined ? number : WidgetWithPropsDefaults.number
        "
        [optionalValue]="
          optionalValue !== undefined
            ? optionalValue
            : WidgetWithPropsDefaults.optionalValue
        "
      ></dx-widget-with-props>
    </ng-template>`,
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

  WidgetWithPropsDefaults = { value: "default text", number: 42 };
}
@NgModule({
  declarations: [TemplateDefaultValue],
  imports: [DxWidgetWithPropsModule, CommonModule],
  exports: [TemplateDefaultValue],
})
export class DxTemplateDefaultValueModule {}
export { TemplateDefaultValue as DxTemplateDefaultValueComponent };
