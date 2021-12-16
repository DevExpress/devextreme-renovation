export const COMPONENT_INPUT_CLASS = "c3";
import { Injectable, Input, ViewChild, ElementRef } from "@angular/core";
import { isSlotEmpty } from "@devextreme/runtime/angular";
@Injectable()
export class WidgetProps {
  @Input() height?: number = 10;
  @Input() width?: number = 10;
  __slotChildren?: ElementRef<HTMLDivElement>;
  get children(): boolean {
    return !isSlotEmpty(this.__slotChildren);
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
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height", "width"],
  template: `<ng-template #widgetTemplate
    ><div></div><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
  defaultEntries: DefaultEntries;
  __onClick(): any {
    const v = this.height;
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
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ["height", "width"].map((key) => ({
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
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
