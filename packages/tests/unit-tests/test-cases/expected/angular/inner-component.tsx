import InnerWidget, {
  InnerWidgetProps,
  DxInnerWidgetModule,
} from "./dx-inner-widget";
import { Input, TemplateRef } from "@angular/core";
export class InnerComponentProps {
  @Input() someTemplate: TemplateRef<any> | null = null;
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
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-inner-component",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["someTemplate"],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export class InnerComponent extends InnerComponentProps {
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
  declarations: [InnerComponent],
  imports: [DxInnerWidgetModule, CommonModule],
  entryComponents: [InnerWidget],
  exports: [InnerComponent],
})
export class DxInnerComponentModule {}
export { InnerComponent as DxInnerComponentComponent };
export default InnerComponent;
