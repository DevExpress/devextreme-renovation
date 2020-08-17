import { Input, ViewChild, ElementRef } from "@angular/core";
export class WidgetOneProps {
  @Input() text?: string;

  @ViewChild("slotChildren") slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.slotChildren?.nativeElement?.innerHTML.trim();
  }
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-one",
  template: `<div>
    <span>One - {{ text }}</span>
    <div #slotChildren style="display:contents">
      <ng-content></ng-content>
    </div>
  </div>`,
})
export default class WidgetOne extends WidgetOneProps {
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [WidgetOne],
  imports: [CommonModule],
  exports: [WidgetOne],
})
export class DxWidgetOneModule {}
