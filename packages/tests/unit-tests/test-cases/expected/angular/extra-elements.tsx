import { InnerLayout as Child, DxInnerLayoutModule } from "./inner-layout";
import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class Props {
  @Input() prop: number = 0;
  @Input() rf?: Child;
}

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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-extra-element",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["prop", "rf"],
  template: `<pre><ng-container *ngIf="rf"><dx-inner-layout #rf
[prop]="3"
style="display: contents"
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="rf?.widgetTemplate"></ng-content></ng-container><div id="firstDiv"></div><dx-inner-layout #rf
[prop]="4"
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="rf?.widgetTemplate"></ng-content><div id="secondDiv"></div><dx-inner-layout [prop]="2"
#child2
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="child2?.widgetTemplate"></ng-content><div id="thirdDiv"></div><dx-inner-layout [prop]="1"
#child3
style="display: contents"></dx-inner-layout><ng-content *ngTemplateOutlet="child3?.widgetTemplate"></ng-content></pre>`,
})
export class ExtraElement extends Props {
  defaultEntries: DefaultEntries;
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new Props() as { [key: string]: any };
    this.defaultEntries = ["prop"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
