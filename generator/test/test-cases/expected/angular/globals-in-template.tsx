import { COMPONENT_INPUT_CLASS } from "./component-input";
export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;
export class WidgetProps {}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget-with-globals",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="global_CLASS_NAME"></div>`,
})
export default class WidgetWithGlobals extends WidgetProps {
  global_CLASS_NAME = CLASS_NAME;

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
  declarations: [WidgetWithGlobals],
  imports: [CommonModule],
  exports: [WidgetWithGlobals],
})
export class DxWidgetWithGlobalsModule {}
export { WidgetWithGlobals as DxWidgetWithGlobalsComponent };
