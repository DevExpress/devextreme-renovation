import Base, { WidgetProps, DxWidgetModule } from "./component-input";
import { Injectable, Input, Output, EventEmitter } from "@angular/core";
@Injectable()
class ChildInput extends WidgetProps {
  @Input() height: number = 10;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
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
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["height", "width"],
  outputs: ["onClick"],
  template: `<ng-template #widgetTemplate
    ><dx-widget
      [height]="__getProps().height"
      #base1
      style="display: contents"
    ></dx-widget
    ><ng-content *ngTemplateOutlet="base1?.widgetTemplate"></ng-content
    ><ng-template #dxchildren><ng-content></ng-content></ng-template
  ></ng-template>`,
})
export default class Child extends ChildInput {
  propsDefaults = new ChildInput();
  __getProps(): WidgetProps {
    return { height: this.height } as WidgetProps;
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
    if (changes["height"] && changes["height"].currentValue === undefined) {
      this.height = this.propsDefaults.height;
    }
    if (changes["width"] && changes["width"].currentValue === undefined) {
      this.width = this.propsDefaults.width;
    }
  }

  _onClick: any;
  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
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
  declarations: [Child],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [Base],
  exports: [Child],
})
export class DxChildModule {}
export { Child as DxChildComponent };
