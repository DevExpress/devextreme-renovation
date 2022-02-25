import { Component, ViewChild, ElementRef } from "@angular/core";
import { isSlotEmpty } from "@devextreme/runtime/angular";
@Component({
  template: "",
})
class WidgetInput {
  __slotChildren?: ElementRef<HTMLDivElement>;
  get children(): boolean {
    return !isSlotEmpty(this.__slotChildren);
  }
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><div #slotChildren style="display: contents"></div>
    <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
    <div class="dx-slot-end" style="display: contents"></div
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
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
  @ViewChild("slotChildren") set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.children;
    this.__slotChildren = slot;
    const newValue = this.children;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
