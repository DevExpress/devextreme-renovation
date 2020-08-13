import { ViewChild, ElementRef } from "@angular/core";
class WidgetInput {
  @ViewChild("slotNamedSlot") slotNamedSlot?: ElementRef<HTMLDivElement>;

  get namedSlot() {
    return this.slotNamedSlot?.nativeElement?.innerHTML.trim();
  }
  @ViewChild("slotChildren") slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.slotChildren?.nativeElement?.innerHTML.trim();
  }
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
