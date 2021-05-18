1;

import { Input } from "@angular/core";
class HelperWidgetProps {
  @Input() forwardRef?: HTMLDivElement | null;
  @Input() someRef?: HTMLDivElement | null;
  @Input() refProp?: HTMLDivElement | null;
  @Input() forwardRefProp?: HTMLDivElement | null;
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
  selector: "dx-helper-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["forwardRef", "someRef", "refProp", "forwardRefProp"],
  template: `<div
    ><div>Ref:{{(===undefined||===null?undefined:.someRef)}}</div
    ><div>ForwardRef:{{(===undefined||===null?undefined:.forwardRef)}}</div
    ><div>RefProp:{{(===undefined||===null?undefined:.refProp)}}</div
    ><div
      >ForwardRefProp:{{(===undefined||===null?undefined:.forwardRefProp)}}</div
    ></div
  >`,
})
export default class HelperWidget extends HelperWidgetProps {
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
  declarations: [HelperWidget],
  imports: [CommonModule],

  exports: [HelperWidget],
})
export class DxHelperWidgetModule {}
export { HelperWidget as DxHelperWidgetComponent };
