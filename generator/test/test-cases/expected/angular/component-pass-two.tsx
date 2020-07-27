import { Input, ViewChild, ElementRef } from "@angular/core";
export class WidgetTwoProps {
  @Input() text?: string;

  @ViewChild("slotChildren") slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.slotChildren?.nativeElement?.innerHTML.trim();
  }
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-two",
  template: `<div>
    <span>Two - {{ text }}</span>
    <div #slotChildren style="display:contents">
      <ng-content></ng-content>
    </div>
  </div>`,
})
export default class WidgetTwo extends WidgetTwoProps {
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [WidgetTwo],
  imports: [CommonModule],
  exports: [WidgetTwo],
})
export class DxWidgetTwoModule {}
