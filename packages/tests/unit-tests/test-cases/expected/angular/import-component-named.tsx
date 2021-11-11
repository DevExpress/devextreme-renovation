import { Widget, DxWidgetModule } from "./export-named";
import { Input } from "@angular/core";
class ChildInput {
  @Input() height: number = 10;
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
  selector: "dx-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height"],
  template: `<ng-template #widgetTemplate
    ><dx-widget [prop]="true" #widget2></dx-widget
    ><ng-content *ngTemplateOutlet="widget2?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class Child extends ChildInput {
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
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [Child],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [Widget],
  exports: [Child],
})
export class DxChildModule {}
export { Child as DxChildComponent };
