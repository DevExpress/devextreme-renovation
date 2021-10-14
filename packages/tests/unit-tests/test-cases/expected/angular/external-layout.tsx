import { InnerLayout, DxInnerLayoutModule } from "./inner-layout";
import { InnerComponent, DxInnerComponentModule } from "./inner-component";
import { Input } from "@angular/core";
export class Props {
  @Input() prop: number = 0;
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

import { DxInnerWidgetModule, InnerWidget } from "./dx-inner-widget";

@Component({
  selector: "dx-external-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["prop"],
  template: `<dx-inner-layout [innerComponentTemplate]="InnerComponent"
    ><ng-template #InnerComponent let-someTemplate="someTemplate"
      ><dx-inner-component
        [someTemplate]="
          someTemplate !== undefined
            ? someTemplate
            : InnerComponentDefaults.someTemplate
        "
      ></dx-inner-component></ng-template
  ></dx-inner-layout>`,
})
export class ExternalLayout extends Props {
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

  InnerComponentDefaults = { someTemplate: InnerWidget };
}
@NgModule({
  declarations: [ExternalLayout],
  imports: [
    DxInnerLayoutModule,
    DxInnerComponentModule,
    CommonModule,
    DxInnerWidgetModule,
  ],
  entryComponents: [InnerLayout, InnerComponent, InnerWidget],
  exports: [ExternalLayout],
})
export class DxExternalLayoutModule {}
export { ExternalLayout as DxExternalLayoutComponent };
export default ExternalLayout;
