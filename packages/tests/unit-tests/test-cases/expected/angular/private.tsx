class WidgetInput {}

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
export default class Widget extends WidgetInput {
  private decoratedState: string = "";
  private simpleState: string = "";
  private get __privateGetter(): any {
    if (this.__getterCache["privateGetter"] !== undefined) {
      return this.__getterCache["privateGetter"];
    }
    return (this.__getterCache["privateGetter"] = ((): any => {
      return this.decoratedState.concat(this.simpleState);
    })());
  }
  __simpleGetter(): any {
    return this.decoratedState.concat(this.simpleState);
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

  __getterCache: {
    privateGetter?: any;
  } = {};

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  set _decoratedState(decoratedState: string) {
    this.decoratedState = decoratedState;
    this._detectChanges();
    this.__getterCache["privateGetter"] = undefined;
  }
  set _simpleState(simpleState: string) {
    this.simpleState = simpleState;
    this._detectChanges();
    this.__getterCache["privateGetter"] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
