import { Input, Output, EventEmitter } from "@angular/core";
class WidgetInput {
  @Input() height: number = 10;
  @Input() export: object = {};
  @Output() onClick: EventEmitter<number> = new EventEmitter();
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
  template: `<span></span>`,
})
export default class Widget extends WidgetInput {
  __getHeight(): number {
    this._onClick(10);
    this._onClick(11);
    return this.height;
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

  _onClick: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onClick = (a: number) => {
      this.onClick.emit(a);
    };
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
