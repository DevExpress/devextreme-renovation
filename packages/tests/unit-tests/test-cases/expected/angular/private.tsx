import { Component } from "@angular/core";
@Component({
  template: "",
})
class WidgetInput {}

import {
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
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
export default class Widget extends WidgetInput {
  private decoratedState: string = "";
  private simpleState: string = "";
  private get __privateGetter(): any {
    return this.decoratedState.concat(this.simpleState);
  }
  __simpleGetter(): any {
    return this.decoratedState.concat(this.simpleState);
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
  set _decoratedState(decoratedState: string) {
    this.decoratedState = decoratedState;
    this._detectChanges();
  }
  set _simpleState(simpleState: string) {
    this.simpleState = simpleState;
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
