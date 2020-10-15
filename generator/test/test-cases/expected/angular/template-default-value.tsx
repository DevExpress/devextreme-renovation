import SampleWidget, { DxSampleWidgetModule } from "./sample-widget";
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
        *ngTemplateOutlet="contentTemplate || contentTemplateDefault"
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          contentTemplate || contentTemplateDefault;
          context: { text: stringToRender }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          contentTemplate || contentTemplateDefault;
          context: { textWithDefault: stringToRender }
        "
      >
      </ng-container></div
    ><ng-template
      #contentTemplateDefault
      let-text="text"
      let-textWithDefault="textWithDefault"
      ><dx-sample-widget
        [text]="text !== undefined ? text : SampleWidgetDefaults.text"
        [textWithDefault]="
          textWithDefault !== undefined
            ? textWithDefault
            : SampleWidgetDefaults.textWithDefault
        "
      ></dx-sample-widget>
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

  SampleWidgetDefaults = { textWithDefault: "swtext", number: 42 };
}
@NgModule({
  declarations: [TemplateDefaultValue],
  imports: [DxSampleWidgetModule, CommonModule],
  exports: [TemplateDefaultValue],
})
export class DxTemplateDefaultValueModule {}
export { TemplateDefaultValue as DxTemplateDefaultValueComponent };
