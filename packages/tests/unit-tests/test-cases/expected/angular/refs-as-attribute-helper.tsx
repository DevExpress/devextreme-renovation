import { Injectable, Input } from "@angular/core";
@Injectable()
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
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-helper-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["forwardRef", "someRef", "refProp", "forwardRefProp"],
  template: `<ng-template #widgetTemplate
    ><div
      ><div>Ref:{{ someRef }}</div
      ><div>ForwardRef:{{ forwardRef }}</div
      ><div>RefProp:{{ refProp }}</div
      ><div>ForwardRefProp:{{ forwardRefProp }}</div></div
    ></ng-template
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
  declarations: [HelperWidget],
  imports: [CommonModule],

  exports: [HelperWidget],
})
export class DxHelperWidgetModule {}
export { HelperWidget as DxHelperWidgetComponent };
