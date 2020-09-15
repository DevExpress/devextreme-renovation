import WidgetWithTemplate, {
  DxWidgetWithTemplateModule,
} from "./dx-widget-with-template";
import InnerWidget, { DxInnerWidgetModule } from "./dx-inner-widget";
export class WidgetProps {}

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
  template: `<dx-widget-with-template
    [template]="CustomTemplate"
    [componentTemplate]="InnerWidget"
    [arrowTemplate]="__arrowTemplate__generated"
    ><ng-template
      #InnerWidget
      let-selected="selected"
      let-value="value"
      let-onSelect="onSelect"
      let-valueChange="valueChange"
      ><dx-inner-widget
        [selected]="selected"
        [value]="value !== undefined ? value : InnerWidgetDefaults.value"
        (onSelect)="
          (onSelect !== undefined ? onSelect : InnerWidgetDefaults.onSelect)(
            $event
          )
        "
        (valueChange)="
          (valueChange !== undefined
            ? valueChange
            : InnerWidgetDefaults.valueChange)($event)
        "
      ></dx-inner-widget></ng-template
    ><ng-template #CustomTemplate let-text="text" let-value="value"
      ><span>{{ text }}</span></ng-template
    ><ng-template #__arrowTemplate__generated let-name="name" let-id="id"
      ><div>{{ name }}</div></ng-template
    ></dx-widget-with-template
  >`,
})
export default class Widget extends WidgetProps {
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

  InnerWidgetDefaults = {
    value: 14,
    onSelect: (e: any) => void 0,
    valueChange: () => {},
  };
}
@NgModule({
  declarations: [Widget],
  imports: [DxWidgetWithTemplateModule, DxInnerWidgetModule, CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
