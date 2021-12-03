import { Injectable, ViewChild, ElementRef } from "@angular/core";
@Injectable()
class SlotsWidgetProps {
  __slotNamedSlot?: ElementRef<HTMLDivElement>;

  get namedSlot() {
    const childNodes = this.__slotNamedSlot?.nativeElement?.childNodes;
    return childNodes && childNodes.length > 2;
  }
  __slotNamedSlotWithSelector?: ElementRef<HTMLDivElement>;

  get namedSlotWithSelector() {
    const childNodes =
      this.__slotNamedSlotWithSelector?.nativeElement?.childNodes;
    return childNodes && childNodes.length > 2;
  }
  __slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    const childNodes = this.__slotChildren?.nativeElement?.childNodes;
    return childNodes && childNodes.length > 2;
  }
}

import {
  Component,
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
        ><div #slotNamedSlotWithSelector style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxnamedSlotWithSelector"
          ></ng-container></div></div
      ><div
        ><div #slotNamedSlot style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxnamedSlot"
          ></ng-container></div></div
      ><div
        ><div #slotChildren style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxchildren"
          ></ng-container></div></div></div
    ><ng-template #dxnamedSlot
      ><ng-content select="[data-namedslot]"></ng-content></ng-template
    ><ng-template #dxnamedSlotWithSelector
      ><ng-content select=".namedSlot"></ng-content></ng-template
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class SlotsWidget extends SlotsWidgetProps {
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
  @ViewChild("slotNamedSlotWithSelector") set slotNamedSlotWithSelector(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.namedSlotWithSelector;
    this.__slotNamedSlotWithSelector = slot;
    const newValue = this.namedSlotWithSelector;
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
