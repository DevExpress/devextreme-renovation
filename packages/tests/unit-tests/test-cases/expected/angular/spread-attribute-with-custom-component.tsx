import InnerWidget, { DxInnerWidgetModule } from "./dx-inner-widget";
export class WidgetInput {}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dx-inner-widget
    [selected]="__attr1.selected !== undefined ? __attr1.selected : false"
    [value]="__attr1.value"
    (onSelect)="__attr1.onSelect($event)"
    (valueChange)="__attr1.valueChange($event)"
  ></dx-inner-widget>`,
})
export default class Widget extends WidgetInput {
  get __attr1(): any {
    return { value: 100, selected: true };
  }
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [DxInnerWidgetModule, CommonModule],
  entryComponents: [InnerWidget],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
