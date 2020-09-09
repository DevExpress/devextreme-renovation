import BaseWidget, { DxWidgetModule } from "./method";
import { Input } from "@angular/core";
class WidgetWithApiRefInput {
  @Input() prop1?: number;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-api-ref",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dx-widget #baseRef [prop1]="prop1"></dx-widget>`,
})
export default class WidgetWithApiRef extends WidgetWithApiRefInput {
  @ViewChild("baseRef", { static: false }) baseRef?: BaseWidget;
  getSomething(): string {
    return `${this.prop1} + ${this.baseRef?.getHeight(1, undefined)}`;
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

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [WidgetWithApiRef],
  imports: [DxWidgetModule, CommonModule],
  exports: [WidgetWithApiRef],
})
export class DxWidgetWithApiRefModule {}
