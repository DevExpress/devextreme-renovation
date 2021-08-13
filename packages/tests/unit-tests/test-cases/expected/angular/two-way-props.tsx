import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
  @Input() height: number = 10;
  @Input() selected: boolean = false;
  @Output() selectedChange: EventEmitter<boolean> = new EventEmitter();
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height", "selected"],
  outputs: ["selectedChange"],
  template: `<span></span>`,
})
export default class Widget extends WidgetInput {
  __getHeight(): number {
    const { height } = this;
    const { height: _height } = this;
    return height + _height;
  }
  __getProps(): any {
    return { ...this, selectedChange: this._selectedChange };
  }
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  _selectedChange: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._selectedChange = (e: any) => {
      this.selectedChange.emit(e);
      this._detectChanges();
    };
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
