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
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

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
  defaultEntries: DefaultEntries;
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
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
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
    const defaultProps = new ChildInput() as { [key: string]: any };
    this.defaultEntries = ["height", "width"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
