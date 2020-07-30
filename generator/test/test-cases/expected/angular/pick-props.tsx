import Props from "./component-bindings-only";
import { Input } from "@angular/core";
class WidgetProps {
  @Input() height?: number = Props.prototype.height;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({ selector: "dx-widget", template: `<div>{{ height }}</div>` })
export default class Widget extends WidgetProps {
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
