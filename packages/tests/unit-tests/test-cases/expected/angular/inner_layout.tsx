import {
  InnerComponent,
  InnerComponentProps,
  DxInnerComponentModule,
} from "./inner_component";
import { Input, TemplateRef } from "@angular/core";
export class InnerLayoutProps {
  @Input() innerComponentTemplate: TemplateRef<any> | null = null;
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
  selector: "dx-inner-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["innerComponentTemplate"],
  template: `<div></div>`,
})
export class InnerLayout extends InnerLayoutProps {
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
  declarations: [InnerLayout],
  imports: [DxInnerComponentModule, CommonModule],
  entryComponents: [InnerComponent],
  exports: [InnerLayout],
})
export class DxInnerLayoutModule {}
export { InnerLayout as DxInnerLayoutComponent };
export default InnerLayout;
