import Props from "./component-bindings-only";
import { Options } from "./types.d";
import { Input } from "@angular/core";
import { AdditionalOptions } from "./types.d";
class WidgetProps {
  @Input() data?: Options = new Props().data;
  @Input() info?: AdditionalOptions = new Props().info;
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
  inputs: ["data", "info"],
  template: `<div>{{
    data === undefined || data === null ? undefined : data.value
  }}</div>`,
})
export default class Widget extends WidgetProps {
  innerData: Options = { value: "" };
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
  set _innerData(innerData: Options) {
    this.innerData = innerData;
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
