import Widget, { DxSlotsWidgetModule } from "./slots";
import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { isSlotEmpty } from "@devextreme/runtime/angular";
@Component({
  template: "",
})
class WidgetInput {
  @Input() p: string = "";
  __slotChildren?: ElementRef<HTMLDivElement>;
  get children(): boolean {
    return !isSlotEmpty(this.__slotChildren);
  }
}

import {
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
      ><dx-slots-widget
        #widget1
        style="display: contents"
        #_auto_ref_0
        [_restAttributes]="rest"
        ><div #slotChildren style="display: contents"></div>
        <ng-container [ngTemplateOutlet]="dxchildren"></ng-container>
        <div
          class="dx-slot-end"
          style="display: contents"
        ></div></dx-slots-widget
      ><ng-content
        *ngTemplateOutlet="widget1?.widgetTemplate"
      ></ng-content></div
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class SlotPass extends WidgetInput {
  defaultEntries: DefaultEntries;

  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }
  get rest(): any {
    return { children: this.children };
  }
  @ViewChild("_auto_ref_0", { static: false })
  _auto_ref_0?: ElementRef<HTMLDivElement>;

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.rest || {};
    const _ref_0 = this._auto_ref_0?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
      }
    }
  }

  ngAfterViewInit() {
    this.__applyAttributes__();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (["children"].some((d) => changes[d] && !changes[d].firstChange)) {
      this.scheduledApplyAttributes = true;
    }
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
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
  imports: [DxSlotsWidgetModule, CommonModule],
  entryComponents: [Widget],
  exports: [SlotPass],
})
export class DxSlotPassModule {}
export { SlotPass as DxSlotPassComponent };
