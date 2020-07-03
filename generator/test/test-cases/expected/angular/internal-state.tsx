import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: "dx-widget",
  template: `<span></span>`,
})
export default class Widget {
  _hovered: Boolean = false;
  __updateState(): any {
    this.__hovered = !this._hovered;
  }
  get __restAttributes(): any {
    return {};
  }

  set __hovered(_hovered: Boolean) {
    this._hovered = _hovered;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
