import WidgetOne, { DxWidgetOneModule } from "./component-pass-one";
import WidgetTwo, { DxWidgetTwoModule } from "./component-pass-two";
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() mode?: boolean = false;
  @Input() firstText?: string;
  @Input() secondText?: string;
}

import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  template: `<dx-widget-one [text]="firstText" *ngIf="mode">
      <div>Slot content</div>
    </dx-widget-one>
    <dx-widget-two [text]="firstText" *ngIf="!mode">
      <div>Slot content</div>
    </dx-widget-two>
    <dx-widget-one [text]="secondText">
      <div>Children go here</div>
    </dx-widget-one>`,
})
export default class Widget extends WidgetProps {
  get __restAttributes(): any {
    return {};
  }
}
@NgModule({
  declarations: [Widget],
  imports: [DxWidgetOneModule, DxWidgetTwoModule, CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
