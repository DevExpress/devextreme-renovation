import { ViewChild, ElementRef } from "@angular/core";
class WidgetInput {
  __slotNamedSlot?: ElementRef<HTMLDivElement>;

  get namedSlot() {
    return this.__slotNamedSlot?.nativeElement?.innerHTML.trim() || "";
  }
  __slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.__slotChildren?.nativeElement?.innerHTML.trim() || "";
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
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div ><div ><ng-container [ngTemplateOutlet]="dxnamedSlot"></ng-container></div><div ><ng-container [ngTemplateOutlet]="dxchildren"></ng-container></div></div><ng-template #dxnamedSlot><div #slotNamedSlot style="display: contents"><ng-contentselect="[namedSlot]"></ng-content></div></ng-template><ng-template #dxchildren><div #slotChildren style="display: contents"><ng-content></ng-content></div></ng-template>`,
})
export default class Widget extends WidgetInput {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(private changeDetection: ChangeDetectorRef) {
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
