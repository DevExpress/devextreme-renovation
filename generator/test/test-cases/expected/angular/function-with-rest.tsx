const someFunction = (arg1: number, arg2: string, ...args: object[]) => {};

export class WidgetInput {}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({ selector: "dx-widget", template: `<div></div>` })
export default class Widget extends WidgetInput {
  __someMethod(...args: object[]): any {}
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
