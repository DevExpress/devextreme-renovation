export const COMPONENT_INPUT_CLASS = "c3";
import { Input, ViewChild, ElementRef } from "@angular/core";
export class WidgetProps {
  __heightInternalValue: number = 10;
  @Input()
  set height(value: number) {
    if (value !== undefined) this.__heightInternalValue = value;
    else this.__heightInternalValue = 10;
  }
  get height() {
    return this.__heightInternalValue;
  }

  __widthInternalValue: number = 10;
  @Input()
  set width(value: number) {
    if (value !== undefined) this.__widthInternalValue = value;
    else this.__widthInternalValue = 10;
  }
  get width() {
    return this.__widthInternalValue;
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
  inputs: ["height", "width"],
  template: `<ng-template #widgetTemplate
    ><div></div><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
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

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
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
