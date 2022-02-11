import {
  InnerComponent,
  InnerComponentProps,
  DxInnerComponentModule,
} from "./inner-component";
import { Component, Input, TemplateRef } from "@angular/core";
@Component({
  template: "",
})
export class InnerLayoutProps {
  @Input() innerComponentTemplate: TemplateRef<any> | null = null;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-inner-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["innerComponentTemplate"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export class InnerLayout extends InnerLayoutProps {
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
  declarations: [InnerLayout],
  imports: [DxInnerComponentModule, CommonModule],
  entryComponents: [InnerComponent],
  exports: [InnerLayout],
})
export class DxInnerLayoutModule {}
export { InnerLayout as DxInnerLayoutComponent };
export default InnerLayout;
