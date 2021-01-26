import Widget, { DxWidgetModule } from "./slots";
import { Input, ViewChild, ElementRef } from "@angular/core";
class WidgetInput {
  @Input() p: string = "";
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
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-slot-pass",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["p"],
  template: `<div
      ><dx-widget
        ><div #slotChildren style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxchildren"
          ></ng-container></div></dx-widget></div
    ><ng-template #dxchildren><ng-content></ng-content></ng-template>`,
})
export default class SlotPass extends WidgetInput {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }
  get rest(): any {
    return { children: this.children };
  }

  constructor(private changeDetection: ChangeDetectorRef) {
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
  declarations: [SlotPass],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [Widget],
  exports: [SlotPass],
})
export class DxSlotPassModule {}
export { SlotPass as DxSlotPassComponent };
