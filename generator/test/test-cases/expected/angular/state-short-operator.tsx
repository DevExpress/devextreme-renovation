import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
  @Input() propState: number = 1;
  @Output() propStateChange: EventEmitter<number> = new EventEmitter();
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `<div></div>`,
})
export default class Widget extends WidgetInput {
  innerState: any = 0;
  __updateState(): any {
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this.propStateChange.emit((this.propState = this.propState + 1));
    this.propStateChange.emit((this.propState = this.propState + 1));
    this.propStateChange.emit((this.propState = this.propState + 1));
    this.propStateChange.emit((this.propState = this.propState + 1));
  }
  get __restAttributes(): any {
    return {};
  }
  set _innerState(innerState: any) {
    this.innerState = innerState;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
