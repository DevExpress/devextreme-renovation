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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height"],
  template: `<dx-widget [prop]="true" #widget12></dx-widget
    ><ng-content *ngTemplateOutlet="widget12.widgetTemplate"></ng-content>`,
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
