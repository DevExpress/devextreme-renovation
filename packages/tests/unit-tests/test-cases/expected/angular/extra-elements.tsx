import { InnerLayout as Child, DxInnerLayoutModule } from "./inner-layout";
import { Input } from "@angular/core";
export class Props {
  @Input() prop: number = 0;
  @Input() rf?: Child;
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
  selector: "dx-extra-element",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["prop", "rf"],
  template: `<pre><dx-inner-layout #rf
[prop]="3"></dx-inner-layout><ng-content *ngTemplateOutlet="rf.widgetTemplate"></ng-content><div id="firstDiv"></div><dx-inner-layout #rf
[prop]="4"></dx-inner-layout><ng-content *ngTemplateOutlet="rf.widgetTemplate"></ng-content><div id="secondDiv"></div><dx-inner-layout [prop]="2"
#child23></dx-inner-layout><ng-content *ngTemplateOutlet="child23.widgetTemplate"></ng-content><div id="thirdDiv"></div><dx-inner-layout [prop]="1"
#child24></dx-inner-layout><ng-content *ngTemplateOutlet="child24.widgetTemplate"></ng-content></pre>`,
})
export class ExtraElement extends Props {
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
  declarations: [ExtraElement],
  imports: [DxInnerLayoutModule, CommonModule],
  entryComponents: [Child],
  exports: [ExtraElement],
})
export class DxExtraElementModule {}
export { ExtraElement as DxExtraElementComponent };
export default ExtraElement;
