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
  Input,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-slots-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["id"],
  template: `<ng-template #widgetTemplate
    ><div [id]="id"
      ><div #slotChildren style="display: contents"></div>
      <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
      <div class="dx-slot-end" style="display: contents"></div></div
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export class SlotsWidget {
  @Input() id?: string;
  __slotChildren?: ElementRef<HTMLDivElement>;
  get children(): boolean {
    return !isSlotEmpty(this.__slotChildren);
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}
  @ViewChild("slotChildren") set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.children;
    this.__slotChildren = slot;
    const newValue = this.children;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
}
@NgModule({
  declarations: [SlotsWidget],
  imports: [CommonModule],

  exports: [SlotsWidget],
})
export class DxSlotsWidgetModule {}
export { SlotsWidget as DxSlotsWidgetComponent };
export default SlotsWidget;
