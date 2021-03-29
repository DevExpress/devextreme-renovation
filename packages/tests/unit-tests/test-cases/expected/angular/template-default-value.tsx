import {
  WidgetWithProps,
  DxWidgetWithPropsModule,
} from "./dx-widget-with-props";
import { Input, TemplateRef } from "@angular/core";
export class TemplateDefaultValueProps {
  @Input() defaultCompTemplate: TemplateRef<any> | null = null;
  @Input() defaultFuncTemplate: TemplateRef<any> | null = null;
  @Input() stringToRender: string = "strCompDefault";
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
  inputs: ["defaultCompTemplate", "defaultFuncTemplate", "stringToRender"],
  template: `<div
      >TemplateDefaultValue<ng-container
        *ngTemplateOutlet="
          defaultCompTemplate || defaultCompTemplateDefault;
          context: { optionalValue: stringToRender, value: 'twdComp' }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          defaultCompTemplate || defaultCompTemplateDefault;
          context: { value: stringToRender }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          defaultFuncTemplate || defaultFuncTemplateDefault;
          context: { value: stringToRender }
        "
      >
      </ng-container></div
    ><ng-template
      #defaultCompTemplateDefault
      let-optionalValue="optionalValue"
      let-value="value"
      ><dx-widget-with-props
        [optionalValue]="
          optionalValue !== undefined
            ? optionalValue
            : WidgetWithPropsDefaults.optionalValue
        "
        [value]="value !== undefined ? value : WidgetWithPropsDefaults.value"
      ></dx-widget-with-props>
    </ng-template>
    <ng-template #defaultFuncTemplateDefault let-value="value">
      <div
        >!DefaultFunc:{{ value || "ftwdCompDefault" }}{{ optionalValue }}</div
      >
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

  WidgetWithPropsDefaults = {
    value: "default text",
    number: 42,
    onClick: (e: any) => void 0,
  };
}
@NgModule({
  declarations: [TemplateDefaultValue],
  imports: [DxWidgetWithPropsModule, CommonModule],
  entryComponents: [WidgetWithProps],
  exports: [TemplateDefaultValue],
})
export class DxTemplateDefaultValueModule {}
export { TemplateDefaultValue as DxTemplateDefaultValueComponent };
