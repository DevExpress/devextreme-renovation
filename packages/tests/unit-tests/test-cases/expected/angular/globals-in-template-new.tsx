import { COMPONENT_INPUT_CLASS } from "./component-input";
import ExternalComponent, { DxCounterModule } from "./counter";
export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;
export type Item = { text: string; key: number };
const getKey = (item: Item) => item.key;

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
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-widget-with-globals",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["items"],
  template: `<ng-template #widgetTemplate
    ><div [class]="global_CLASS_NAME"
      ><span [class]="global_CLASS_NAME"></span><dx-counter></dx-counter
      ><ng-container *ngFor="let item of items; trackBy: _trackBy_items_0"
        ><div></div></ng-container></div
  ></ng-template>`,
})
export class WidgetWithGlobals {
  global_CLASS_NAME = CLASS_NAME;
  defaultEntries: DefaultEntries;
  @Input() items: Item[] = [];
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  _trackBy_items_0(_index: number, item: any) {
    return getKey(item);
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
    this.defaultEntries = [{ key: "items", value: [] }];
  }
}
@NgModule({
  declarations: [WidgetWithGlobals],
  imports: [DxCounterModule, CommonModule],
  entryComponents: [ExternalComponent],
  exports: [WidgetWithGlobals],
})
export class DxWidgetWithGlobalsModule {}
export { WidgetWithGlobals as DxWidgetWithGlobalsComponent };
export default WidgetWithGlobals;
