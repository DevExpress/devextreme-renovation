export class WidgetInput {}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #_auto_ref_0></div>`,
})
export default class Widget extends WidgetInput {
  get __attr1(): any {
    return {};
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("_auto_ref_0", { static: false }) _auto_ref_0?: ElementRef<
    HTMLDivElement
  >;
  __applyAttributes__() {
    const _attr_0: { [name: string]: string } = this.__attr1 || {};
    const _ref_0 = this._auto_ref_0?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key]);
      }
    }
  }

  ngOnChanges(changes: { [name: string]: any }) {
    this.__applyAttributes__();
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
