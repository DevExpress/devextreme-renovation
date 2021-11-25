import BaseWidget, { DxWidgetModule } from "./method";
import { Injectable, Input } from "@angular/core";
@Injectable()
class WidgetWithApiRefInput {
  @Input() prop1?: number;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-api-ref",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["prop1"],
  template: `<ng-template #widgetTemplate
    ><dx-widget #baseRef [prop1]="prop1" style="display: contents"></dx-widget
    ><ng-content *ngTemplateOutlet="baseRef?.widgetTemplate"></ng-content
  ></ng-template>`,
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [WidgetWithApiRef],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [BaseWidget],
  exports: [WidgetWithApiRef],
})
export class DxWidgetWithApiRefModule {}
export { WidgetWithApiRef as DxWidgetWithApiRefComponent };
