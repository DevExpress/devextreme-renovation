import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  constructor(private changeDetection: ChangeDetectorRef) {}
  set __hovered(_hovered: Boolean) {
    this._hovered = _hovered;
    this.changeDetection.detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
