import BaseProps from "./component-bindings-only";
export interface PropsI {
  p: string;
}

interface WidgetI {
  onClick(): void;
}

import { Input } from "@angular/core";
class WidgetInput extends BaseProps {
  __pInternalValue: string = "10";
  @Input()
  set p(value: string) {
    if (value !== undefined) this.__pInternalValue = value;
    else this.__pInternalValue = "10";
  }
  get p() {
    return this.__pInternalValue;
  }
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
  inputs: ["p", "height", "data", "info"],
  template: `<ng-template #widgetTemplate><span></span></ng-template>`,
})
export default class Widget extends WidgetInput {
  __onClick(): void {}
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
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
