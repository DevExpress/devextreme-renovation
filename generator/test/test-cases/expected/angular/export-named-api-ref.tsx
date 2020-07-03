class WidgetInput {}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `<div></div>`,
})
export class Widget extends WidgetInput {
  getValue(): any {
    return 0;
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
export default Widget;
