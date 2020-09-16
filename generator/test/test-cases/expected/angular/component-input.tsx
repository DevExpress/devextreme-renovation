export const COMPONENT_INPUT_CLASS = "c3";
import { Input, ViewChild, ElementRef } from "@angular/core";
export class WidgetProps {
  @Input() height?: number = 10;
  @Input() width?: number = 10;
  __slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.__slotChildren?.nativeElement?.innerHTML.trim();
  }
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
  template: `<div></div>`,
})
export default class Widget extends WidgetProps {
  __onClick(): any {
    const v = this.height;
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

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  @ViewChild("slotChildren") set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    this.__slotChildren = slot;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
