import { Input, Output, EventEmitter } from "@angular/core";
export class WidgetWithPropsInput {
  @Input() value: string = "default text";
  @Input() optionalValue?: string;
  @Input() number?: number = 42;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
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
  selector: "dx-widget-with-props",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["value", "optionalValue", "number"],
  outputs: ["onClick"],
  template: `<div>{{ optionalValue || value }}</div>`,
})
export class WidgetWithProps extends WidgetWithPropsInput {
  doSomething(): any {}
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
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
  }
}
@NgModule({
  declarations: [WidgetWithProps],
  imports: [CommonModule],
  exports: [WidgetWithProps],
})
export class DxWidgetWithPropsModule {}
export { WidgetWithProps as DxWidgetWithPropsComponent };
export default WidgetWithProps;
