import { Component, ViewChild, ElementRef } from "@angular/core";
import { isSlotEmpty } from "@devextreme/runtime/angular";
@Component({
  template: "",
})
class SlotsWidgetProps {
  __slotNamedSlot?: ElementRef<HTMLDivElement>;
  get namedSlot(): boolean {
    return !isSlotEmpty(this.__slotNamedSlot);
  }
  __slotSelectorNamedSlot?: ElementRef<HTMLDivElement>;
  get selectorNamedSlot(): boolean {
    return !isSlotEmpty(this.__slotSelectorNamedSlot);
  }
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
  selector: "dx-slots-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><div
      ><div
        ><div #slotSelectorNamedSlot style="display: contents"></div>
        <ng-container [ngTemplateOutlet]="dxselectorNamedSlot"></ng-container>
        <div class="dx-slot-end" style="display: contents"></div></div
      ><div
        ><div #slotNamedSlot style="display: contents"></div>
        <ng-container [ngTemplateOutlet]="dxnamedSlot"></ng-container>
        <div class="dx-slot-end" style="display: contents"></div></div
      ><div
        ><div #slotChildren style="display: contents"></div>
        <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
        <div class="dx-slot-end" style="display: contents"></div></div></div
    ><ng-template #dxnamedSlot
      ><ng-content select="[data-namedslot]"></ng-content></ng-template
    ><ng-template #dxselectorNamedSlot
      ><ng-content select=".namedSlot"></ng-content></ng-template
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class SlotsWidget extends SlotsWidgetProps {
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
  @ViewChild("slotNamedSlot") set slotNamedSlot(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.namedSlot;
    this.__slotNamedSlot = slot;
    const newValue = this.namedSlot;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
  @ViewChild("slotSelectorNamedSlot") set slotSelectorNamedSlot(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.selectorNamedSlot;
    this.__slotSelectorNamedSlot = slot;
    const newValue = this.selectorNamedSlot;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
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
  declarations: [SlotsWidget],
  imports: [CommonModule],

  exports: [SlotsWidget],
})
export class DxSlotsWidgetModule {}
export { SlotsWidget as DxSlotsWidgetComponent };
