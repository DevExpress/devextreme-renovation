import { Widget, DxWidgetModule } from "./export-named";
import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
class ChildInput {
  @Input() height: number = 10;
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
  selector: "dx-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height"],
  template: `<ng-template #widgetTemplate
    ><dx-widget [prop]="true" #widget1 style="display: contents"></dx-widget
    ><ng-content *ngTemplateOutlet="widget1?.widgetTemplate"></ng-content
  ></ng-template>`,
})
export default class Child extends ChildInput {
  defaultEntries: DefaultEntries;

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
    const defaultProps = new ChildInput() as { [key: string]: any };
    this.defaultEntries = ["height"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
