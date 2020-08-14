import { Widget, DxWidgetModule } from "./export-named";
import { Input } from "@angular/core";
class ChildInput {
  @Input() height: number = 10;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-child",
  template: `<dx-widget [prop]="true"></dx-widget>`,
})
export default class Child extends ChildInput {
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [Child],
  imports: [DxWidgetModule, CommonModule],
  exports: [Child],
})
export class DxChildModule {}
