import { COMPONENT_INPUT_CLASS } from "./component-input";
import {
  WidgetTwo as ExternalComponent,
  DxWidgetTwoModule,
} from "./component-pass-two";
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
  template: `<div [class]="global_CLASS_NAME"
    ><span [class]="global_CLASS_NAME"></span><dx-widget-two></dx-widget-two
  ></div>`,
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
  imports: [DxWidgetTwoModule, CommonModule],
  exports: [WidgetWithGlobals],
})
export class DxWidgetWithGlobalsModule {}
export { WidgetWithGlobals as DxWidgetWithGlobalsComponent };
