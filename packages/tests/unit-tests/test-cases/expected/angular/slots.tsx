import { ViewChild, ElementRef } from "@angular/core";
class WidgetInput {
  __slotNamedSlot?: ElementRef<HTMLDivElement>;

  get namedSlot() {
    const childNodes = this.__slotNamedSlot?.nativeElement?.childNodes;
    return childNodes && childNodes.length > 2;
  }
  __slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    const childNodes = this.__slotChildren?.nativeElement?.childNodes;
    return childNodes && childNodes.length > 2;
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
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #widgetTemplate
    ><div
      ><div
        ><div #slotNamedSlot style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxnamedSlot"
          ></ng-container></div></div
      ><div
        ><div #slotChildren style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxchildren"
          ></ng-container></div></div></div
    ><ng-template #dxnamedSlot
      ><ng-content select="[namedSlot]"></ng-content></ng-template
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
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
  @ViewChild("slotNamedSlot") set slotNamedSlot(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.namedSlot;
    this.__slotNamedSlot = slot;
    const newValue = this.namedSlot;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
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
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
