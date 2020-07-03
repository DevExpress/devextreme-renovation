export const COMPONENT_INPUT_CLASS = "c3";

import { Input, ViewChild, ElementRef } from "@angular/core";
export class WidgetProps {
  @Input() height?: number = 10;
  @Input() width?: number = 10;

  @ViewChild("slotChildren") slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.slotChildren?.nativeElement?.innerHTML.trim();
  }
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: "dx-widget",
  template: `<div></div>`,
})
export default class Widget extends WidgetProps {
  __onClick(): any {
    const v = this.height;
  }
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
