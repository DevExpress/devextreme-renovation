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
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["data", "info"],
  template: `<ng-template #widgetTemplate
    ><div>{{
      data === undefined || data === null ? undefined : data.value
    }}</div></ng-template
  >`,
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
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
