import Base, { WidgetProps, DxWidgetModule } from "./component-input";
import { Input, Output, EventEmitter } from "@angular/core";
class ChildInput extends WidgetProps {
  @Input() height: number = 10;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  _onClick!: (a: number) => void;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-child",
  template: `<dx-widget [height]="__getProps().height"></dx-widget>`,
})
export default class Child extends ChildInput {
  __getProps(): WidgetProps {
    return { height: this.height } as WidgetProps;
  }
  get __restAttributes(): any {
    return {};
  }

  constructor() {
    super();
    this._onClick = this.onClick.emit.bind(this.onClick);
  }
}
@NgModule({
  declarations: [Child],
  imports: [DxWidgetModule, CommonModule],
  exports: [Child],
})
export class DxChildModule {}
