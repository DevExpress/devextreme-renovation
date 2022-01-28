import { Component } from "@angular/core";
@Component({
  template: "",
})
export class Props {}

import {
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
  selector: "dx-inner-component",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export class InnerComponent extends Props {
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
  declarations: [InnerComponent],
  imports: [CommonModule],

  exports: [InnerComponent],
})
export class DxInnerComponentModule {}
export { InnerComponent as DxInnerComponentComponent };
export default InnerComponent;
