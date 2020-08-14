import { ElementRef } from "@angular/core";
class WidgetInput {
  __slotNamedSlot?: ElementRef<HTMLDivElement>;
  get namedSlot() {
    return this.__slotNamedSlot?.nativeElement?.innerHTML.trim();
  }
  __slotChildren?: ElementRef<HTMLDivElement>;
  get children() {
    return this.__slotChildren?.nativeElement?.innerHTML.trim();
  }
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    <div>
      <div #slotNamedSlot style="display: contents">
        <ng-content select="[namedSlot]"></ng-content>
      </div>
    </div>
    <div>
      <div #slotChildren style="display: contents">
        <ng-content></ng-content>
      </div>
    </div>
  </div>`,
})
export default class Widget extends WidgetInput {
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("slotNamedSlot") set slotNamedSlot(
    slot: ElementRef<HTMLDivElement>
  ) {
    this.__slotNamedSlot = slot;
    this.changeDetection.detectChanges();
  }
  @ViewChild("slotChildren") set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    this.__slotChildren = slot;
    this.changeDetection.detectChanges();
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
