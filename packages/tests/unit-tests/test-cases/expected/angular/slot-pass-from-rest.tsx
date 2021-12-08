import Widget, { DxWidgetModule } from "./slots";
import { Injectable, Input, ViewChild, ElementRef } from "@angular/core";
@Injectable()
class WidgetInput {
  @Input() p: string = "";
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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-slot-pass",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["p"],
  template: `<ng-template #widgetTemplate
    ><div
      ><dx-widget #widget1 style="display: contents"
        ><div #slotChildren style="display: contents"
          ><ng-container
            [ngTemplateOutlet]="dxchildren"
          ></ng-container></div></dx-widget
      ><ng-content
        *ngTemplateOutlet="widget1?.widgetTemplate"
      ></ng-content></div
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class SlotPass extends WidgetInput {
  defaultEntries: DefaultEntries;
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }
  get rest(): any {
    return { children: this.children };
  }

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = ["p"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
  declarations: [SlotPass],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [Widget],
  exports: [SlotPass],
})
export class DxSlotPassModule {}
export { SlotPass as DxSlotPassComponent };
