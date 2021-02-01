type EventCallBack<Type> = (e: Type) => void;

import { Input } from "@angular/core";
export class WidgetInput {
  @Input() someProp?: { current: string };
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
  inputs: ["someProp"],
  template: `<span></span>`,
})
export default class Widget extends WidgetInput {
  someState?: { current: string };
  existsState: { current: string } = { current: "value" };
  __concatStrings(): any {
    const fromProps = this.someProp?.current || "";
    const fromState = this.someState?.current || "";
    return `${fromProps}${fromState}${this.existsState.current}`;
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
  set _someState(someState: { current: string }) {
    this.someState = someState;
    this._detectChanges();
  }
  set _existsState(existsState: { current: string }) {
    this.existsState = existsState;
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
