import Base, { WidgetProps, DxWidgetModule } from "./component-input";
import { Input, Output, EventEmitter } from "@angular/core";
class ChildInput extends WidgetProps {
  @Input() height: number = 10;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
}

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
  selector: "dx-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dx-widget [height]="__getProps().height"></dx-widget>`,
})
export default class Child extends ChildInput {
  __getProps(): WidgetProps {
    return { height: this.height } as WidgetProps;
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("slotChildren") set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    this.__slotChildren = slot;
    this.changeDetection.detectChanges();
  }

  _onClick: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onClick = (a: number) => {
      this.onClick.emit(a);
      this.changeDetection.detectChanges();
    };
  }
}
@NgModule({
  declarations: [Child],
  imports: [DxWidgetModule, CommonModule],
  exports: [Child],
})
export class DxChildModule {}
