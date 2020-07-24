import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
  @Input() propState: number = 1;
  @Output() propStateChange: EventEmitter<number> = new EventEmitter();
  _propStateChange!: (propState: number) => void;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({ selector: "dx-widget", template: `<div></div>` })
export default class Widget extends WidgetInput {
  innerState: any = 0;
  __updateState(): any {
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._innerState = this.innerState + 1;
    this._propStateChange((this.propState = this.propState + 1));
    this._propStateChange((this.propState = this.propState + 1));
    this._propStateChange((this.propState = this.propState + 1));
    this._propStateChange((this.propState = this.propState + 1));
  }
  get __restAttributes(): any {
    return {};
  }

  constructor() {
    super();
    this._propStateChange = this.propStateChange.emit.bind(
      this.propStateChange
    );
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
