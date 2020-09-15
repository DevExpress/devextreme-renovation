import WidgetOne, { DxWidgetOneModule } from "./component-pass-one";
import { WidgetTwo, DxWidgetTwoModule } from "./component-pass-two";
import { Input } from "@angular/core";
export class WidgetProps {
  @Input() mode?: boolean = false;
  @Input() firstText?: string;
  @Input() secondText?: string;
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
  template: `<dx-widget-one [text]="firstText" *ngIf="mode"
      ><div>Slot content</div></dx-widget-one
    ><dx-widget-two [text]="firstText" *ngIf="!mode"
      ><div>Slot content</div></dx-widget-two
    ><dx-widget-one [text]="secondText"
      ><div>Children go here</div></dx-widget-one
    ><dx-widget-one
      text="self closing by condition"
      *ngIf="mode"
    ></dx-widget-one
    ><dx-widget-two
      text="self closing by condition"
      *ngIf="!mode"
    ></dx-widget-two
    ><dx-widget-two text="self closing"></dx-widget-two
    ><dx-widget-one [text]="secondText" *ngIf="mode"></dx-widget-one
    ><dx-widget-two [text]="secondText" *ngIf="!mode"></dx-widget-two>`,
})
export default class Widget extends WidgetProps {
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
}
@NgModule({
  declarations: [Widget],
  imports: [DxWidgetOneModule, DxWidgetTwoModule, CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
